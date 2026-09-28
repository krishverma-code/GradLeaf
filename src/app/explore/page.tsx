'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import {
  Search,
  Users,
  Orbit,
  X,
  RotateCcw,
  GraduationCap,
  Code2,
  User,
  Send,
  Check,
  UserPlus,
} from 'lucide-react';

type SearchScope = 'all' | 'name' | 'skill' | 'college';

function matchesStudentSearch(
  student: {
    name: string;
    college: string;
    course: string;
    headline?: string | null;
    interests?: string | null;
    skills?: { skill: { name: string } }[];
  },
  rawQuery: string,
  searchMode: SearchScope = 'all'
): boolean {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  // Split query into tokens for multi-term search e.g. "alex mit"
  const tokens = query.split(/\s+/).filter(Boolean);

  // Helper: check if any word in text starts with token
  const wordStartsWith = (text: string | null | undefined, token: string) => {
    if (!text) return false;
    const words = text
      .toLowerCase()
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(/[\s,.\-&/()]+/)
      .filter(Boolean);
    
    // Exact word start, or if token is at least 4 chars long, substring within word
    return words.some((w) => w.startsWith(token) || (token.length >= 4 && w.includes(token)));
  };

  // Helper: check acronym (e.g. "MIT", "NIT", "UCB", "AI", "CS", "IT")
  const acronymMatches = (text: string | null | undefined, token: string) => {
    if (!text || token.length < 2) return false;
    const words = text.split(/[\s,.\-&/()]+/).filter(Boolean);
    const acronym = words.map((w) => w[0]).join('').toLowerCase();
    return acronym === token || acronym.startsWith(token);
  };

  // Student Name: matches if name contains token or any word starts with token
  const matchesName = (token: string) => {
    const nameLower = student.name.toLowerCase();
    if (nameLower.includes(token)) return true;
    return wordStartsWith(student.name, token);
  };

  // Skills: exact start, word parts (e.g. "Torch" in "PyTorch"), or known abbreviations
  const matchesSkill = (token: string) => {
    if (!student.skills || student.skills.length === 0) return false;
    return student.skills.some((us) => {
      const sName = us.skill.name.toLowerCase();
      // Whole skill name starts with token (e.g. "react", "next.js", "python", "fastapi")
      if (sName.startsWith(token)) return true;

      const parts = us.skill.name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .split(/[\s.\-/]+/)
        .filter(Boolean);
      
      // If token length >= 3, check if any constituent word starts with token (e.g. "torch" in "PyTorch")
      if (token.length >= 3 && parts.some((p) => p.startsWith(token))) return true;

      // If token is 1-2 chars, only match if a constituent word equals token or is a short abbreviation
      if (token.length < 3 && parts.some((p) => p === token || (p.length <= 3 && p.startsWith(token)))) return true;

      // Substring match only for longer queries (>= 4 chars)
      if (token.length >= 4 && sName.includes(token)) return true;

      return false;
    });
  };

  // College & Degree: word boundary matching (e.g. "Tech" -> "Technology", "Stan" -> "Stanford")
  const matchesCollege = (token: string) => {
    return (
      wordStartsWith(student.college, token) ||
      wordStartsWith(student.course, token) ||
      acronymMatches(student.college, token) ||
      acronymMatches(student.course, token)
    );
  };

  const matchesInterests = (token: string) => {
    if (!student.interests) return false;
    return wordStartsWith(student.interests, token);
  };

  const matchesHeadline = (token: string) => {
    if (!student.headline || token.length < 3) return false;
    return wordStartsWith(student.headline, token);
  };

  return tokens.every((token) => {
    if (searchMode === 'name') {
      return matchesName(token);
    }
    if (searchMode === 'skill') {
      return matchesSkill(token);
    }
    if (searchMode === 'college') {
      return matchesCollege(token);
    }

    // Default 'all' smart search
    return (
      matchesName(token) ||
      matchesSkill(token) ||
      matchesCollege(token) ||
      matchesInterests(token) ||
      matchesHeadline(token)
    );
  });
}

export default function ExplorePage() {
  const { allUsers, currentUser, refreshUsers, setShowCreateProfileModal } = useUser();
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<SearchScope>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  // Match Modal State
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [matchModalStudent, setMatchModalStudent] = useState<any | null>(null);
  const [matchProjectId, setMatchProjectId] = useState('');
  const [matchRole, setMatchRole] = useState('');
  const [matchMessage, setMatchMessage] = useState('');
  const [sendingMatch, setSendingMatch] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const list = await res.json();
          // Crucial: Only allow proposing matches for projects owned by currentUser
          const myProjects = currentUser
            ? list.filter((p: any) => p.ownerId === currentUser.id)
            : [];
          setUserProjects(myProjects);
          if (myProjects.length > 0) {
            setMatchProjectId(myProjects[0].id);
          } else {
            setMatchProjectId('');
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, [currentUser?.id]);

  const handleOpenMatchModal = (student: any) => {
    setMatchModalStudent(student);
    if (userProjects.length > 0 && (!matchProjectId || !userProjects.some((p) => p.id === matchProjectId))) {
      setMatchProjectId(userProjects[0].id);
    }
    const topSkills = student.skills?.map((s: any) => s.skill.name).slice(0, 3).join(', ') || 'your skillset';
    let suggestedRole = 'Teammate';
    if (student.skills?.some((s: any) => s.skill.name.toLowerCase().includes('react') || s.skill.name.toLowerCase().includes('frontend'))) {
      suggestedRole = 'Frontend Lead';
    } else if (student.skills?.some((s: any) => s.skill.name.toLowerCase().includes('python') || s.skill.name.toLowerCase().includes('langchain') || s.skill.name.toLowerCase().includes('ai'))) {
      suggestedRole = 'AI / ML Specialist';
    } else if (student.skills?.some((s: any) => s.skill.name.toLowerCase().includes('go') || s.skill.name.toLowerCase().includes('postgres') || s.skill.name.toLowerCase().includes('node'))) {
      suggestedRole = 'Backend Engineer';
    }
    setMatchRole(suggestedRole);
    setMatchMessage(`Hi ${student.name.split(' ')[0]}! We saw your profile on Explore and your expertise in ${topSkills} is an ideal match for our project. We would love to collaborate!`);
    setMatchSuccess(false);
  };

  const handleSendMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchModalStudent || !currentUser || !matchProjectId) return;
    setSendingMatch(true);
    try {
      const res = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: matchProjectId,
          senderId: currentUser.id,
          receiverId: matchModalStudent.id,
          role: matchRole,
          message: matchMessage,
        }),
      });
      if (res.ok) {
        setMatchSuccess(true);
        refreshUsers();
        setTimeout(() => {
          setMatchModalStudent(null);
          setMatchSuccess(false);
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMatch(false);
    }
  };

  const skillsList = ['All', 'React', 'Python', 'TypeScript', 'Next.js', 'FastAPI', 'UI/UX Design', 'Go', 'Docker', 'PostgreSQL'];

  // Crucial: Filter out the logged-in user so they NEVER see themselves in Explore to match with
  const filteredUsers = allUsers.filter((u) => {
    if (currentUser && u.id === currentUser.id) return false;

    const matchesSearch = matchesStudentSearch(u, search, searchMode);
    const matchesSkillTag =
      selectedSkill === 'All' ||
      (u.skills && u.skills.some((s) => s.skill.name.toLowerCase() === selectedSkill.toLowerCase()));

    return matchesSearch && matchesSkillTag;
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSkill('All');
    setSearchMode('all');
  };

  const isFiltered = search.trim() !== '' || selectedSkill !== 'All' || searchMode !== 'all';

  const placeholders: Record<SearchScope, string> = {
    all: 'Search students by name, college, or skills...',
    name: 'Search strictly by student name (e.g. Alex, Priya)...',
    skill: 'Search by skill or technology (e.g. React, Python, Docker)...',
    college: 'Search by university or course (e.g. Stanford, MIT, B.Tech)...',
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header & Search Controls */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-glass-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold mb-2 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>GradLeaf Verified Student Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Campus Talent & Collaborators
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-2xl leading-relaxed">
              Discover peer engineers, designers, and researchers across colleges filtered by skills, academic domain, and live project availability.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateProfileModal(true)}
            className="btn-gradleaf-primary shrink-0 inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold shadow-tactile active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Create Student Profile</span>
          </button>
        </div>

        {/* Search Mode Scope Pills + Search Box */}
        <div className="space-y-3 max-w-2xl">
          {/* Scope Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1">Scope:</span>
            {(
              [
                { id: 'all', label: 'All Fields', icon: Search },
                { id: 'name', label: 'Name Only', icon: User },
                { id: 'skill', label: 'Skills', icon: Code2 },
                { id: 'college', label: 'University / Course', icon: GraduationCap },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSearchMode(mode.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  searchMode === mode.id
                    ? 'btn-gradleaf-dark text-white shadow-tactile-dark'
                    : 'bg-white/90 border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-800 shadow-2xs'
                }`}
              >
                {mode.icon && <mode.icon className="w-3.5 h-3.5" />}
                {mode.label}
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholders[searchMode]}
              className="neu-input w-full text-xs pl-11 pr-10 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Skill Tags Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100/90">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1">Skills:</span>
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedSkill === skill
                  ? 'btn-gradleaf-primary text-white shadow-tactile'
                  : 'bg-white/90 border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-800 shadow-2xs'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header / Active Filters Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-800">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'student' : 'students'} found
          </span>
          {isFiltered && (
            <span className="text-slate-400 font-medium">
              (Filtered{search.trim() ? ` by "${search.trim()}"` : ''}
              {selectedSkill !== 'All' ? ` in ${selectedSkill}` : ''})
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset filters
          </button>
        )}
      </div>

      {/* Students Directory Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((student) => (
            <div
              key={student.id}
              className="glass-card rounded-3xl border border-slate-200/80 hover:border-emerald-300 p-6 shadow-glass-card hover:shadow-tactile transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5">
                  <Link href={`/profile/${student.id}`}>
                    <img
                      src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'}
                      alt={student.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-tactile-subtle hover:opacity-85 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${student.id}`}
                      className="font-extrabold text-base text-slate-900 hover:text-emerald-700 transition-colors block truncate tracking-tight"
                    >
                      {student.name}
                    </Link>
                    <p className="text-xs text-emerald-800 font-semibold truncate">{student.course}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{student.college}</p>
                  </div>
                </div>

                {student.headline && (
                  <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                    &quot;{student.headline}&quot;
                  </p>
                )}

                {/* Skills */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
                    Proficiencies & Tech:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills?.slice(0, 4).map((us) => (
                      <span
                        key={us.id}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-emerald-900 font-bold shadow-2xs"
                      >
                        {us.skill.name}
                      </span>
                    ))}
                    {(student.skills?.length || 0) > 4 && (
                      <span className="text-[10px] text-slate-400 font-bold self-center">
                        +{(student.skills?.length || 0) - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Year {student.year}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenMatchModal(student)}
                    className="btn-gradleaf-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-tactile cursor-pointer"
                  >
                    <Orbit className="w-3.5 h-3.5 text-emerald-200" /> Match
                  </button>
                  <Link
                    href={`/profile/${student.id}`}
                    className="btn-gradleaf-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl border border-dashed border-slate-200 p-14 text-center space-y-3.5 shadow-glass-card">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">No students found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
            {search.trim()
              ? `No students matched "${search.trim()}" in ${searchMode === 'all' ? 'any field' : searchMode}. Try searching by first name or a different keyword.`
              : 'No students match the current filter selection.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="btn-gradleaf-primary inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-tactile cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Search & Filters
          </button>
        </div>
      )}

      {/* Direct Match Proposal Modal */}
      {matchModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-card rounded-3xl border border-white/60 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100/90 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 tracking-tight">
                  <Orbit className="w-4.5 h-4.5 text-[#274d36]" />
                  Propose Match with {matchModalStudent.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Send a collaboration invitation to join your project team
                </p>
              </div>
              <button
                onClick={() => setMatchModalStudent(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {matchSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50/80 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-2xs">
                  ✓
                </div>
                <h4 className="font-extrabold text-emerald-950 text-base">Match Proposal Sent!</h4>
                <p className="text-xs text-emerald-800 max-w-xs mx-auto font-medium">
                  {matchModalStudent.name} has been notified and will receive this under &ldquo;Requests to Match&rdquo;.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Your Project / Venture:
                  </label>
                  {userProjects.length > 0 ? (
                    <select
                      value={matchProjectId}
                      onChange={(e) => setMatchProjectId(e.target.value)}
                      className="neu-input w-full text-xs font-bold p-3 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {userProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.domain})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1.5 shadow-2xs">
                      <p className="font-bold">You don&apos;t have any active projects to recruit for yet.</p>
                      <p className="text-[11px] text-amber-700">
                        Create your project first in the Projects section to propose matches and invite peers to your team.
                      </p>
                      <Link
                        href="/projects"
                        className="inline-block mt-1 font-bold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        Create a Project →
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Proposed Role for {matchModalStudent.name.split(' ')[0]}:
                  </label>
                  <input
                    type="text"
                    required
                    value={matchRole}
                    onChange={(e) => setMatchRole(e.target.value)}
                    placeholder="e.g. Frontend Lead, AI Specialist, UI Designer"
                    className="neu-input w-full text-xs font-medium p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Personalized Pitch / Invitation Message:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={matchMessage}
                    onChange={(e) => setMatchMessage(e.target.value)}
                    className="neu-input w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100/90">
                  <Link
                    href={`/matching${matchProjectId ? `?projectId=${matchProjectId}&candidateId=${matchModalStudent.id}` : `?candidateId=${matchModalStudent.id}`}`}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Orbit className="w-3.5 h-3.5 text-[#274d36]" /> Open in Smart Matcher
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMatchModalStudent(null)}
                      className="btn-gradleaf-secondary px-4 py-2.5 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingMatch || userProjects.length === 0}
                      className="btn-gradleaf-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl shadow-tactile cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {sendingMatch ? 'Sending...' : 'Send Proposal'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
