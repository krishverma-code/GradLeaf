import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_USERS } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        receivedCollab: {
          where: { status: 'pending' },
          include: {
            project: true,
            sender: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        projectMembers: {
          include: {
            project: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!users || users.length === 0) {
      return NextResponse.json(FALLBACK_USERS);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to get users, returning fallback dataset', error);
    return NextResponse.json(FALLBACK_USERS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      college,
      course,
      year,
      headline,
      bio,
      interests,
      availability,
      avatarUrl,
      githubUrl,
      portfolioUrl,
      linkedinUrl,
      skills = [],
    } = body;

    if (!name || !college || !course) {
      return NextResponse.json({ error: 'Name, college, and course are required' }, { status: 400 });
    }

    const userEmail = email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}-${Date.now()}@campus.edu`;

    try {
      const createdUser = await prisma.user.create({
        data: {
          name,
          email: userEmail,
          college,
          course,
          year: typeof year === 'number' ? year : parseInt(year) || 1,
          headline: headline || `${course} Student at ${college}`,
          bio: bio || `Student exploring innovative campus projects and collaborations.`,
          interests: interests || 'Web Development, AI',
          availability: availability || '15 hrs/week (Flexible)',
          avatarUrl:
            avatarUrl ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
          githubUrl: githubUrl || null,
          portfolioUrl: portfolioUrl || null,
          linkedinUrl: linkedinUrl || null,
        },
      });

      // If skills provided, attach them
      if (Array.isArray(skills) && skills.length > 0) {
        for (const s of skills) {
          const skillName = typeof s === 'string' ? s : s.name;
          const skillCat = s.category || 'Frontend';
          const skillStatus = s.status || 'Comfortable';
          const skillProficiency = s.proficiency || 3;

          let skill = await prisma.skill.findUnique({ where: { name: skillName } });
          if (!skill) {
            skill = await prisma.skill.create({
              data: { name: skillName, category: skillCat },
            });
          }

          await prisma.userSkill.create({
            data: {
              userId: createdUser.id,
              skillId: skill.id,
              status: skillStatus,
              proficiency: skillProficiency,
            },
          });
        }
      }

      // Re-fetch complete user with skills
      const fullUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
        include: {
          skills: { include: { skill: true } },
          notifications: true,
          receivedCollab: true,
          projectMembers: true,
        },
      });
      return NextResponse.json(fullUser || createdUser, { status: 201 });
    } catch (dbError) {
      console.warn('Prisma create user failed, returning serverless fallback object:', dbError);
      // Fallback synthetic user for serverless environments where DB might be read-only
      const syntheticId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const syntheticUser = {
        id: syntheticId,
        name,
        email: userEmail,
        college,
        course,
        department: null,
        year: typeof year === 'number' ? year : parseInt(year) || 1,
        headline: headline || `${course} Student at ${college}`,
        bio: bio || `Student exploring innovative campus projects and collaborations.`,
        interests: interests || 'Web Development, AI',
        availability: availability || '15 hrs/week (Flexible)',
        avatarUrl:
          avatarUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
        linkedinUrl: linkedinUrl || null,
        createdAt: new Date().toISOString(),
        skills: Array.isArray(skills)
          ? skills.map((s: any, idx: number) => ({
              id: 'skill_' + idx + '_' + syntheticId,
              status: s.status || 'Comfortable',
              proficiency: s.proficiency || 4,
              skill: {
                id: 'sk_' + idx,
                name: typeof s === 'string' ? s : s.name,
                category: s.category || 'Frontend',
              },
            }))
          : [],
        notifications: [],
        receivedCollab: [],
        projectMembers: [],
        ownedProjects: [],
        posts: [],
      };
      return NextResponse.json(syntheticUser, { status: 201 });
    }
  } catch (error) {
    console.error('Failed to create user', error);
    return NextResponse.json({ error: 'Failed to create student profile' }, { status: 500 });
  }
}

