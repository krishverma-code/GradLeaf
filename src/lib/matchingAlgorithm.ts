export interface CandidateMatchResult {
  userId: string;
  name: string;
  avatarUrl: string | null;
  college: string;
  course: string;
  headline: string | null;
  availability: string | null;
  overallScore: number; // 0 - 100
  factors: {
    skillScore: number;       // 0 - 40
    interestScore: number;    // 0 - 20
    availabilityScore: number;// 0 - 20
    experienceScore: number;  // 0 - 10
    balanceScore: number;     // 0 - 10
  };
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  recommendationBadge: 'Top Match' | 'Strong Fit' | 'Complementary Skillset' | 'Potential Match';
}

export function computeProjectMatches(
  project: {
    id: string;
    domain: string;
    skills: { skill: { name: string }; role?: string | null; priority: string }[];
    members: { user: { id: string; skills: { skill: { name: string } }[] } }[];
  },
  candidates: {
    id: string;
    name: string;
    avatarUrl: string | null;
    college: string;
    course: string;
    headline: string | null;
    bio: string | null;
    interests: string | null;
    availability: string | null;
    skills: {
      status: string;
      proficiency: number;
      skill: { name: string; category: string };
    }[];
    projectMembers: { project: { title: string; domain: string } }[];
  }[]
): CandidateMatchResult[] {
  const requiredSkillNames = project.skills.map((s) => s.skill.name.toLowerCase());
  
  // Existing team skills
  const existingTeamSkills = new Set<string>();
  for (const m of project.members) {
    if (m.user?.skills) {
      for (const us of m.user.skills) {
        existingTeamSkills.add(us.skill.name.toLowerCase());
      }
    }
  }

  const results: CandidateMatchResult[] = [];

  for (const candidate of candidates) {
    const candidateSkillsMap = new Map<string, { status: string; proficiency: number; category: string }>();
    for (const us of candidate.skills) {
      candidateSkillsMap.set(us.skill.name.toLowerCase(), {
        status: us.status,
        proficiency: us.proficiency,
        category: us.skill.category,
      });
    }

    // 1. Skill Match (40% max)
    let matchedSkills: string[] = [];
    let missingSkills: string[] = [];
    let skillScoreRaw = 0;

    if (requiredSkillNames.length > 0) {
      for (const reqSkill of requiredSkillNames) {
        const found = candidateSkillsMap.get(reqSkill);
        if (found) {
          matchedSkills.push(reqSkill);
          // Bonus for higher proficiency or project experience
          const proficiencyMult = found.status === 'Comfortable' || found.proficiency >= 4
            ? 1.0
            : found.status === 'Project Experience' || found.proficiency === 3
            ? 0.95
            : 0.8;
          skillScoreRaw += (1 / requiredSkillNames.length) * 40 * proficiencyMult;
        } else {
          missingSkills.push(reqSkill);
        }
      }
    } else {
      skillScoreRaw = 35; // fallback if project has no specified skills
    }
    const skillScore = Math.min(40, Math.round(skillScoreRaw));

    // 2. Interest / Domain Match (20% max)
    let interestScore = 0;
    const projectDomainLower = project.domain.toLowerCase();
    const candidateInterestsLower = (candidate.interests || '').toLowerCase();
    const candidateBioLower = (candidate.bio || '').toLowerCase();

    if (
      candidateInterestsLower.includes(projectDomainLower) ||
      (projectDomainLower.includes('ai') && (candidateInterestsLower.includes('ai') || candidateInterestsLower.includes('machine learning'))) ||
      (projectDomainLower.includes('web') && (candidateInterestsLower.includes('web') || candidateInterestsLower.includes('frontend') || candidateInterestsLower.includes('fullstack'))) ||
      (projectDomainLower.includes('mobile') && (candidateInterestsLower.includes('mobile') || candidateInterestsLower.includes('flutter')))
    ) {
      interestScore = 20;
    } else if (candidateBioLower.includes(projectDomainLower.split(' ')[0])) {
      interestScore = 15;
    } else if (candidateInterestsLower.length > 0) {
      interestScore = 10;
    }

    // 3. Availability Match (20% max)
    let availabilityScore = 5;
    const avail = (candidate.availability || '').toLowerCase();
    if (avail.includes('15') || avail.includes('20') || avail.includes('flexible') || avail.includes('hackathon')) {
      availabilityScore = 20;
    } else if (avail.includes('10')) {
      availabilityScore = 15;
    } else if (avail.length > 0) {
      availabilityScore = 10;
    }

    // 4. Relevant Experience (10% max)
    const pastProjectCount = candidate.projectMembers?.length || 0;
    const highProficiencyCount = candidate.skills.filter((s) => s.proficiency >= 3).length;
    let experienceScore = 5;
    if (pastProjectCount >= 2 || highProficiencyCount >= 3) {
      experienceScore = 10;
    } else if (pastProjectCount >= 1 || highProficiencyCount >= 2) {
      experienceScore = 8;
    }

    // 5. Team Balance (10% max)
    // Does candidate provide required skills that fill project needs?
    let balanceScore = 0;
    const bringsUniqueSkills = matchedSkills.some((s) => !existingTeamSkills.has(s));
    if (bringsUniqueSkills || (matchedSkills.length > 0 && matchedSkills.length === requiredSkillNames.length)) {
      balanceScore = 10;
    } else if (matchedSkills.length > 0) {
      balanceScore = 7;
    }

    // Total Score can reach 100 when all factors are satisfied
    const overallScore = Math.min(100, Math.max(0, skillScore + interestScore + availabilityScore + experienceScore + balanceScore));

    // Generate human-readable explanation
    let explanation = '';
    const matchedNames = matchedSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    
    if (overallScore === 100) {
      explanation = `Exceptional 100% alignment across all evaluation dimensions: possesses all required skills (${matchedNames}), perfect domain alignment in ${project.domain}, verified project track record, and ideal availability.`;
    } else if (matchedSkills.length > 0 && bringsUniqueSkills) {
      explanation = `Recommended because their ${matchedNames} skillset directly addresses key project requirements and fills vacant technical gaps on your current team.`;
    } else if (matchedSkills.length > 0) {
      explanation = `Strong candidate with ${matchedNames} capabilities and strong interest in ${project.domain} alongside flexible schedule overlap.`;
    } else if (interestScore >= 15) {
      explanation = `High domain alignment in ${project.domain} with demonstrated fast-learning aptitude and solid collaborative availability.`;
    } else {
      explanation = `Profile aligns with complementary technical disciplines and available project hours.`;
    }

    let recommendationBadge: CandidateMatchResult['recommendationBadge'] = 'Potential Match';
    if (overallScore >= 85) recommendationBadge = 'Top Match';
    else if (overallScore >= 75) recommendationBadge = 'Strong Fit';
    else if (bringsUniqueSkills && overallScore >= 65) recommendationBadge = 'Complementary Skillset';

    results.push({
      userId: candidate.id,
      name: candidate.name,
      avatarUrl: candidate.avatarUrl,
      college: candidate.college,
      course: candidate.course,
      headline: candidate.headline,
      availability: candidate.availability,
      overallScore,
      factors: {
        skillScore,
        interestScore,
        availabilityScore,
        experienceScore,
        balanceScore,
      },
      matchedSkills,
      missingSkills,
      explanation,
      recommendationBadge,
    });
  }

  // Sort descending by overallScore
  return results.sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Calculates a match score (0 - 100) between a user and a project or another user.
 */
export function calculatePairMatchScore(
  userA: {
    id?: string;
    skills?: { skill?: { name: string }; proficiency?: number; status?: string }[];
    interests?: string | null;
    availability?: string | null;
  },
  projectOrUserB: {
    id?: string;
    domain?: string;
    skills?: { skill?: { name: string } }[];
    interests?: string | null;
    availability?: string | null;
  }
): number {
  // 1. Identity / Self-match check
  if (userA.id && projectOrUserB.id && userA.id === projectOrUserB.id) {
    return 100;
  }

  const skillsA = (userA.skills || []).map((s) => s.skill?.name?.toLowerCase() || '').filter(Boolean);
  const targetSkills = (projectOrUserB.skills || []).map((s) => s.skill?.name?.toLowerCase() || '').filter(Boolean);

  // 1. Skill Alignment (up to 45 points)
  let skillPoints = 0;
  if (targetSkills.length > 0) {
    const matched = targetSkills.filter((ts) => skillsA.includes(ts));
    skillPoints = Math.round((matched.length / targetSkills.length) * 45);
  } else if (skillsA.length > 0) {
    skillPoints = 30;
  }

  // 2. Domain / Interest score (up to 25 points)
  const intA = (userA.interests || '').toLowerCase();
  const domainB = (projectOrUserB.domain || projectOrUserB.interests || '').toLowerCase();
  let domainPoints = 5;
  if (intA && domainB) {
    if (intA === domainB) {
      domainPoints = 25;
    } else {
      const words = domainB.split(/[, \/]+/).filter((w) => w.length > 2);
      if (words.some((w) => intA.includes(w))) {
        domainPoints = 25;
      } else {
        domainPoints = 12;
      }
    }
  } else {
    domainPoints = 15; // neutral fallback
  }

  // 3. Availability alignment (up to 20 points)
  const availA = (userA.availability || '').toLowerCase();
  const availB = (projectOrUserB.availability || '').toLowerCase();
  let availPoints = 10;
  const isHighAvailA = availA.includes('15') || availA.includes('20') || availA.includes('hackathon') || availA.includes('flexible');
  const isHighAvailB = !availB || availB.includes('15') || availB.includes('20') || availB.includes('hackathon') || availB.includes('flexible');

  if (isHighAvailA && isHighAvailB) {
    availPoints = 20;
  } else if (isHighAvailA || isHighAvailB) {
    availPoints = 15;
  }

  // 4. Synergy baseline (up to 10 points)
  const synergyPoints = 10;

  const total = Math.min(100, Math.max(0, skillPoints + domainPoints + availPoints + synergyPoints));
  return total;
}
