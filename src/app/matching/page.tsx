'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import {
  Orbit,
  Users,
  CheckCircle,
  Clock,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Send,
  Sliders,
  ExternalLink,
  Award,
} from 'lucide-react';

interface MatchItem {
  userId: string;
  name: string;
  avatarUrl: string | null;
  college: string;
  course: string;
  headline: string | null;
  availability: string | null;
  overallScore: number;
  factors: {
    skillScore: number;
    interestScore: number;
    availabilityScore: number;
    experienceScore: number;
    balanceScore: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  recommendationBadge: 'Top Match' | 'Strong Fit' | 'Complementary Skillset' | 'Potential Match';
}

interface ProjectOption {
  id: string;
  title: string;
  domain: string;
  ownerId: string;
  skills: { skill: { name: string }; role: string | null }[];
  members?: { userId: string; role?: string }[];
}

function MatchingPageContent() {
  const searchParams = useSearchParams();
  const paramProjectId = searchParams.get('projectId');
  const paramCandidateId = searchParams.get('candidateId');

  const { currentUser, allUsers } = useUser();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [focusedCandidateId, setFocusedCandidateId] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync candidateId from URL parameter
  useEffect(() => {
    if (paramCandidateId) {
      setFocusedCandidateId(paramCandidateId);
    }
  }, [paramCandidateId]);

  // Invite modal state
  const [inviteCandidate, setInviteCandidate] = useState<MatchItem | null>(null);
  const [inviteRole, setInviteRole] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSentSuccess, setInviteSentSuccess] = useState(false);

  // 1. Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const list: ProjectOption[] = await res.json();
          setProjects(list);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, []);

  // Filter projects owned or joined strictly by the active user
  const userProjects = React.useMemo(() => {
    if (!currentUser) return [];
    return projects.filter(
      (p) => p.ownerId === currentUser.id || p.members?.some((m) => m.userId === currentUser.id)
    );
  }, [projects, currentUser?.id]);

  // 2. Select appropriate project when currentUser, userProjects, or paramProjectId changes
  useEffect(() => {
    if (userProjects.length > 0) {
      if (paramProjectId && userProjects.some((p) => p.id === paramProjectId)) {
        setSelectedProjectId(paramProjectId);
      } else if (!userProjects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(userProjects[0].id);
      }
    } else {
      setSelectedProjectId('');
      setMatches([]);
      setProjectData(null);
      setLoading(false);
    }
  }, [userProjects, selectedProjectId, paramProjectId]);

  // 3. Fetch matches when selectedProjectId changes
  useEffect(() => {
    if (!selectedProjectId) {
      setMatches([]);
      setProjectData(null);
      setLoading(false);
      return;
    }
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const excludeParam = currentUser?.id ? `&excludeUserId=${currentUser.id}` : '';
        const res = await fetch(`/api/matching?projectId=${selectedProjectId}${excludeParam}`);
        if (res.ok) {
          const data = await res.json();
          const validMatches = (data.matches || []).filter(
            (m: MatchItem) => m.userId !== currentUser?.id
          );
          setMatches(validMatches);
          setProjectData(data.project);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [selectedProjectId, currentUser?.id]);

  const handleOpenInvite = (candidate: MatchItem) => {
    setInviteCandidate(candidate);
    // Find prefill role from matched skills
    let defaultRole = 'Fullstack Developer';
    if (candidate.matchedSkills.some((s) => s.toLowerCase().includes('react'))) {
      defaultRole = 'Frontend Lead (React)';
    } else if (candidate.matchedSkills.some((s) => s.toLowerCase().includes('langchain') || s.toLowerCase().includes('pytorch'))) {
      defaultRole = 'AI Integration Member';
    } else if (candidate.matchedSkills.some((s) => s.toLowerCase().includes('postgres') || s.toLowerCase().includes('sql') || s.toLowerCase().includes('fastapi'))) {
      defaultRole = 'Backend & Database Engineer';
    }
    setInviteRole(defaultRole);
    setInviteMessage(
      `Hi ${candidate.name.split(' ')[0]}! We saw your profile on GradLeaf and your expertise in ${candidate.matchedSkills.join(', ')} is an ideal match for "${projectData?.title}". We'd love to have you on the team!`
    );
    setInviteSentSuccess(false);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCandidate || !currentUser || !selectedProjectId) return;
    setSendingInvite(true);
    try {
      const res = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          senderId: currentUser.id,
          receiverId: inviteCandidate.userId,
          role: inviteRole,
          message: inviteMessage,
        }),
      });
      if (res.ok) {
        setInviteSentSuccess(true);
        setTimeout(() => {
          setInviteCandidate(null);
          setInviteSentSuccess(false);
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingInvite(false);
    }
  };

  const badgeStyles = {
    'Top Match': 'badge-enamel-green text-[10px] font-bold px-2.5 py-0.5 rounded-full',
    'Strong Fit': 'bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
    'Complementary Skillset': 'bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
    'Potential Match': 'bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
  };

  const displayedMatches = focusedCandidateId
    ? matches.filter((m) => m.userId === focusedCandidateId)
    : matches;
  const focusedCandidate = focusedCandidateId
    ? matches.find((m) => m.userId === focusedCandidateId)
    : null;

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-glass-card">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-2 shadow-2xs">
            <Orbit className="w-3.5 h-3.5 text-[#274d36]" />
            <span>GradLeaf Explainable AI Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Teammate Matching
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Multi-factor compatibility evaluating candidate technical competencies, domain interests, and peer availability with explainable rationale.
          </p>
        </div>

        {/* Project Selector */}
        <div className="min-w-[320px] max-w-sm">
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Project:
            </label>
            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
              {currentUser?.name?.split(' ')[0]}&apos;s Active Projects ({userProjects.length})
            </span>
          </div>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={userProjects.length === 0}
            className="neu-input w-full text-xs font-bold rounded-xl p-2.5 text-slate-900 focus:outline-none disabled:opacity-60"
          >
            {userProjects.length === 0 ? (
              <option value="" disabled>
                No active projects for {currentUser?.name || 'this user'}
              </option>
            ) : (
              userProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.domain})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Empty State when current user has no active projects */}
      {userProjects.length === 0 ? (
        <div className="glass-card border border-slate-200 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-sm space-y-4 my-8">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 shadow-2xs">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              No Active Projects for {currentUser?.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Smart Teammate Matching recommends candidates based on your project&apos;s required tech stack. Create a project in the Marketplace to start finding matched peers!
            </p>
          </div>
          <div className="flex items-center justify-center pt-2">
            <Link
              href="/projects"
              className="btn-gradleaf-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-tactile active:scale-95"
            >
              + Create Project in Marketplace
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Project Requirements Overview Banner - Frosted Glass Aurora */}
          {projectData && (
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-emerald-200/80 bg-gradient-to-br from-white/95 via-emerald-50/50 to-slate-50/90 shadow-[0_12px_36px_-15px_rgba(20,45,31,0.07),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-200/25 to-teal-100/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/70 text-emerald-950 text-xs font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Target Requirements • {projectData.domain}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{projectData.title}</h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {projectData.requiredSkills.map((req: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/90 border border-emerald-200/80 text-emerald-900 px-3 py-1 rounded-xl flex items-center gap-1.5 font-bold shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {req.role ? `${req.role}: ${req.name}` : req.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 shrink-0">
                <Link
                  href={`/workspace/${projectData.id}`}
                  className="btn-gradleaf-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-tactile active:scale-95"
                >
                  Open Project Workspace <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

      {/* Match Results List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-40"></div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-14 glass-card rounded-3xl border border-slate-200/80 shadow-glass-card">
          <p className="text-slate-500 text-sm font-medium">No candidate matches found outside current project members.</p>
        </div>
      ) : displayedMatches.length === 0 ? (
        <div className="text-center py-14 glass-card rounded-3xl border border-slate-200/80 shadow-glass-card space-y-3">
          <p className="text-slate-600 text-sm font-semibold">
            {focusedCandidateId
              ? 'This student is already a member of this project workspace or has no match evaluation outside project members.'
              : 'No candidate matches found outside current project members.'}
          </p>
          {focusedCandidateId && (
            <button
              type="button"
              onClick={() => setFocusedCandidateId(null)}
              className="btn-gradleaf-primary px-4 py-2 text-xs font-bold rounded-xl shadow-tactile cursor-pointer"
            >
              View All Evaluated Peers ({matches.length})
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {focusedCandidateId && (
            <div className="glass-card rounded-2xl p-4 border border-emerald-300/80 bg-emerald-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-tactile-subtle">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#274d36] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                  <Orbit className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex flex-wrap items-center gap-2">
                    <span>Focused Candidate Evaluation:</span>
                    <span className="font-extrabold text-slate-900">
                      {focusedCandidate?.name || 'Selected Candidate'}
                    </span>
                    {focusedCandidate && (
                      <span className="badge-enamel-green text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {focusedCandidate.overallScore}% Fit
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Filtered specifically to evaluate this candidate against &ldquo;{projectData?.title || 'your project'}&rdquo;.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFocusedCandidateId(null)}
                className="btn-gradleaf-secondary px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer self-start sm:self-auto shrink-0"
              >
                View All Candidates ({matches.length})
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">
              {focusedCandidateId
                ? `Evaluation for ${focusedCandidate?.name || 'Selected Candidate'}`
                : `Ranked Candidates (${matches.length} peers evaluated)`}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-emerald-200/80 text-emerald-800 font-semibold shadow-2xs">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" /> Weighted Criteria: Skill 40% | Domain 20% | Availability 20% | Exp 10% | Balance 10%
            </span>
          </div>

          {displayedMatches.map((candidate) => (
            <div
              key={candidate.userId}
              className="glass-card rounded-3xl border border-slate-200/80 hover:border-emerald-300 p-6 sm:p-7 shadow-glass-card hover:shadow-tactile transition-all space-y-4"
            >
              {/* Top row: Avatar + Profile + Score badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${candidate.userId}`}>
                    <img
                      src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                      alt={candidate.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-tactile-subtle hover:opacity-85 transition-opacity"
                    />
                  </Link>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/profile/${candidate.userId}`}
                        className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                      >
                        {candidate.name}
                      </Link>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          badgeStyles[candidate.recommendationBadge]
                        }`}
                      >
                        {candidate.recommendationBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      {candidate.course} • {candidate.college}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">
                      &quot;{candidate.headline}&quot;
                    </p>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-baseline gap-1.5 px-3 py-1 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
                    <span className="text-3xl font-black text-emerald-700 tracking-tight">{candidate.overallScore}%</span>
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Match</span>
                  </div>
                  <button
                    onClick={() => handleOpenInvite(candidate)}
                    className="btn-gradleaf-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-tactile cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Invite to Team
                  </button>
                </div>
              </div>

              {/* Explainable Rationale Box */}
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-inner">
                <Orbit className="w-4 h-4 text-[#274d36] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-900 mr-1.5">Why Recommended:</span>
                  <span>{candidate.explanation}</span>
                </div>
              </div>

              {/* Factors Breakdown Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100/90 text-xs">
                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block font-medium">Skill Match (40%)</span>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{candidate.factors.skillScore} / 40</div>
                </div>
                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block font-medium">Domain Interest (20%)</span>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{candidate.factors.interestScore} / 20</div>
                </div>
                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block font-medium">Availability (20%)</span>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{candidate.factors.availabilityScore} / 20</div>
                </div>
                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block font-medium">Experience (10%)</span>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{candidate.factors.experienceScore} / 10</div>
                </div>
                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block font-medium">Team Balance (10%)</span>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{candidate.factors.balanceScore} / 10</div>
                </div>
              </div>

              {/* Matched Skills badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-semibold">Covered skills:</span>
                {candidate.matchedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {sk}
                  </span>
                ))}
                {candidate.missingSkills.length > 0 && (
                  <span className="text-slate-400 text-[11px]">
                    (Open roles for other peers: {candidate.missingSkills.join(', ')})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* Invite Modal */}
      {inviteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-card rounded-3xl border border-white/60 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100/90 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                Invite {inviteCandidate.name} to Join Project
              </h3>
              <button
                onClick={() => setInviteCandidate(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {inviteSentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-lg">Invitation Sent!</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {inviteCandidate.name} will be notified in their inbox and can accept to join the project workspace.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Project Role:
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="neu-input w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Personalized Invitation Message:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="neu-input w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteCandidate(null)}
                    className="btn-gradleaf-secondary px-4 py-2.5 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingInvite}
                    className="btn-gradleaf-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl shadow-tactile cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingInvite ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse font-medium">Loading Smart Matcher...</div>}>
      <MatchingPageContent />
    </Suspense>
  );
}
