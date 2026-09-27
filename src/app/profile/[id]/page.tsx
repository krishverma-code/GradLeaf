'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import {
  GraduationCap,
  Orbit,
  Github,
  Globe,
  Linkedin,
  Clock,
  Briefcase,
  Trophy,
  Edit3,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  UserPlus,
  Check,
  X,
  Inbox,
  Send,
  UserCheck,
  MessageSquare,
  Zap,
  Camera,
  Upload,
  Users,
} from 'lucide-react';
import { calculatePairMatchScore } from '@/lib/matchingAlgorithm';

const avatarPresets = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
];

interface SkillItem {
  id: string;
  status: 'Learning' | 'Practicing' | 'Project Experience' | 'Comfortable';
  proficiency: number;
  skill: { id: string; name: string; category: string };
}

interface MatchRequest {
  id: string;
  projectId: string;
  senderId: string;
  receiverId: string;
  role: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  project: { id: string; title: string; domain: string };
  sender?: { id: string; name: string; avatarUrl: string | null; course: string; college: string };
  receiver?: { id: string; name: string; avatarUrl: string | null; course: string; college: string };
  matchScore?: number;
}

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  college: string;
  course: string;
  department: string | null;
  year: number;
  headline: string | null;
  bio: string | null;
  interests: string | null;
  availability: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  skills: SkillItem[];
  ownedProjects: any[];
  projectMembers: { project: any }[];
  posts: any[];
  receivedCollab?: MatchRequest[];
  sentCollab?: MatchRequest[];
}

import { FALLBACK_USERS } from '@/lib/fallbackData';

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  const { currentUser, refreshUsers } = useUser();
  const initialStudent =
    (userId ? FALLBACK_USERS.find((u) => u.id === userId || u.name.toLowerCase().includes(userId.toLowerCase())) : null) ||
    FALLBACK_USERS[0];
  const [profile, setProfile] = useState<UserProfileData | null>(initialStudent as any);
  const [loading, setLoading] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(initialStudent.name || '');
  const [college, setCollege] = useState(initialStudent.college || '');
  const [course, setCourse] = useState(initialStudent.course || '');
  const [year, setYear] = useState<number>(initialStudent.year || 3);
  const [interests, setInterests] = useState(initialStudent.interests || '');
  const [headline, setHeadline] = useState(initialStudent.headline || '');
  const [bio, setBio] = useState(initialStudent.bio || '');
  const [availability, setAvailability] = useState(initialStudent.availability || '');
  const [avatarUrl, setAvatarUrl] = useState(initialStudent.avatarUrl || '');
  const [uploadError, setUploadError] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [saving, setSaving] = useState(false);

  // Enlarged Avatar Lightbox State
  const [showEnlargedAvatar, setShowEnlargedAvatar] = useState(false);

  // Skill gap analysis state
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [loadingGaps, setLoadingGaps] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || '');
        setCollege(data.college || '');
        setCourse(data.course || '');
        setYear(data.year || 3);
        setInterests(data.interests || '');
        setHeadline(data.headline || '');
        setBio(data.bio || '');
        setAvailability(data.availability || '');
        setAvatarUrl(data.avatarUrl || '');
      } else {
        const { FALLBACK_USERS } = await import('@/lib/fallbackData');
        const fallback =
          FALLBACK_USERS.find((u) => u.id === userId || u.name.toLowerCase().includes(userId.toLowerCase())) ||
          FALLBACK_USERS[0];
        setProfile(fallback as any);
        setName(fallback.name || '');
        setCollege(fallback.college || '');
        setCourse(fallback.course || '');
        setYear(fallback.year || 3);
        setInterests(fallback.interests || '');
        setHeadline(fallback.headline || '');
        setBio(fallback.bio || '');
        setAvailability(fallback.availability || '');
        setAvatarUrl(fallback.avatarUrl || '');
      }
    } catch (e) {
      console.error('Failed to fetch profile, using fallback:', e);
      const { FALLBACK_USERS } = await import('@/lib/fallbackData');
      const fallback =
        FALLBACK_USERS.find((u) => u.id === userId || u.name.toLowerCase().includes(userId.toLowerCase())) ||
        FALLBACK_USERS[0];
      setProfile(fallback as any);
      setName(fallback.name || '');
      setCollege(fallback.college || '');
      setCourse(fallback.course || '');
      setYear(fallback.year || 3);
      setInterests(fallback.interests || '');
      setHeadline(fallback.headline || '');
      setBio(fallback.bio || '');
      setAvailability(fallback.availability || '');
      setAvatarUrl(fallback.avatarUrl || '');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image size exceeds 4MB. Please choose a smaller photo.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const handleAIEnhanceBio = async () => {
    setIsGeneratingAI(true);
    try {
      const currentSkillNames = profile?.skills?.map((s) => s.skill.name).join(', ');
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance_bio',
          input: {
            college: college || profile?.college,
            skills: currentSkillNames,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) setBio(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          college,
          course,
          year: parseInt(String(year), 10) || 1,
          interests,
          headline,
          bio,
          availability,
          avatarUrl,
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchProfile();
        refreshUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSkillGaps = async () => {
    setLoadingGaps(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skill_gap' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSkillGaps(data.gaps || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGaps(false);
    }
  };

  const [respondingCollabId, setRespondingCollabId] = useState<string | null>(null);

  const handleRespondCollab = async (collabId: string, status: 'accepted' | 'rejected') => {
    setRespondingCollabId(collabId);
    try {
      const res = await fetch(`/api/collab/${collabId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchProfile();
        refreshUsers();
      }
    } catch (e) {
      console.error('Failed to respond to match request', e);
    } finally {
      setRespondingCollabId(null);
    }
  };

  // Match with Student Modal State (for viewing someone else's profile)
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [matchProjectId, setMatchProjectId] = useState('');
  const [matchRole, setMatchRole] = useState('Teammate');
  const [matchMessage, setMatchMessage] = useState('');
  const [sendingMatch, setSendingMatch] = useState(false);
  const [matchSentSuccess, setMatchSentSuccess] = useState(false);

  // Load projects owned by currentUser for the match invite dropdown
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const projs = await res.json();
          const myProjects = projs.filter((p: any) => p.ownerId === currentUser.id);
          setAllProjects(myProjects);
          if (myProjects.length > 0) {
            setMatchProjectId(myProjects[0].id);
          } else {
            setMatchProjectId('');
          }
        }
      } catch (e) {
        console.error('Failed to fetch projects', e);
      }
    };
    fetchUserProjects();
  }, [currentUser?.id]);

  const handleOpenMatchModal = () => {
    if (!profile) return;
    if (allProjects.length > 0 && (!matchProjectId || !allProjects.some((p) => p.id === matchProjectId))) {
      setMatchProjectId(allProjects[0].id);
    }
    const topSkills = profile.skills?.map((s) => s.skill.name).slice(0, 3).join(', ') || 'your skillset';
    let suggestedRole = 'Teammate';
    if (profile.skills?.some((s) => s.skill.name.toLowerCase().includes('react') || s.skill.name.toLowerCase().includes('frontend'))) {
      suggestedRole = 'Frontend Lead';
    } else if (profile.skills?.some((s) => s.skill.name.toLowerCase().includes('python') || s.skill.name.toLowerCase().includes('langchain'))) {
      suggestedRole = 'AI / ML Specialist';
    } else if (profile.skills?.some((s) => s.skill.name.toLowerCase().includes('go') || s.skill.name.toLowerCase().includes('postgres') || s.skill.name.toLowerCase().includes('node'))) {
      suggestedRole = 'Backend Engineer';
    }
    setMatchRole(suggestedRole);
    setMatchMessage(`Hi ${profile.name.split(' ')[0]}! I checked out your profile on GradLeaf and your background in ${topSkills} looks like a fantastic match. Would you be interested in collaborating?`);
    setMatchSentSuccess(false);
    setShowMatchModal(true);
  };

  const handleSendMatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profile || !matchProjectId) return;
    setSendingMatch(true);
    try {
      const res = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: matchProjectId,
          senderId: currentUser.id,
          receiverId: profile.id,
          role: matchRole,
          message: matchMessage,
        }),
      });
      if (res.ok) {
        setMatchSentSuccess(true);
        refreshUsers();
        setTimeout(() => {
          setShowMatchModal(false);
          setMatchSentSuccess(false);
        }, 1800);
      }
    } catch (e) {
      console.error('Failed to send match request', e);
    } finally {
      setSendingMatch(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-rose-500">Student Profile not found.</div>;
  }

  const isOwner = currentUser?.id === profile.id;

  const statusColors: Record<string, string> = {
    Comfortable: 'badge-enamel-green text-[10px] font-bold px-2.5 py-0.5 rounded-full',
    'Project Experience': 'bg-teal-50 text-teal-800 border border-teal-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
    Practicing: 'bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
    Learning: 'bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl border border-slate-200/90 shadow-glass-card p-3.5 sm:p-4 bg-white/90 space-y-4">
        {/* Inset Procedural Aurora Mesh & Vector Grid Canvas (No External Image) */}
        <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 border border-slate-800/80 shadow-inner bg-slate-950">
          {/* Luminous Multi-layered Aurora Glow Orbs */}
          <div className="absolute -top-14 -left-14 w-80 h-80 bg-gradient-to-br from-emerald-500/35 to-teal-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 right-8 w-96 h-96 bg-gradient-to-tr from-teal-500/30 via-emerald-600/25 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Isometric / Tech Vector Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

          {/* Micro-dot Star/Particle Matrix */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

          {/* Generative Flowing Vector Wave Curves */}
          <svg className="absolute inset-0 w-full h-full opacity-45 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aurora-wire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path d="M-100,50 C160,170 360,20 620,90 C860,160 1060,40 1350,100" fill="none" stroke="url(#aurora-wire)" strokeWidth="1.5" />
            <path d="M-50,90 C210,30 410,150 710,60 C960,140 1160,30 1450,80" fill="none" stroke="url(#aurora-wire)" strokeWidth="1.5" />
            <path d="M0,130 C260,190 510,70 810,130 C1060,60 1260,140 1550,110" fill="none" stroke="url(#aurora-wire)" strokeWidth="1.5" />
          </svg>

          {/* Top Left: Verified Academic Status Pill */}
          <div className="absolute top-4 left-4 hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            Campus Tech Portfolio
          </div>

          {/* Top Right: Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2.5 z-10">
            {isOwner ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-800 font-bold text-xs shadow-md border border-white/40 active:scale-95 transition-all backdrop-blur-md cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={handleOpenMatchModal}
                className="btn-gradleaf-primary text-xs font-bold px-4.5 py-2 rounded-xl shadow-tactile flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Orbit className="w-3.5 h-3.5 text-emerald-200" /> Match with {profile.name.split(' ')[0]}
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Area */}
        <div className="px-2 sm:px-3 pt-0 pb-2">
          {/* Avatar and Top Actions row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            {/* Left: Avatar overlapping banner + Details */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div
                onClick={() => setShowEnlargedAvatar(true)}
                className="relative shrink-0 -mt-16 sm:-mt-20 ml-2 sm:ml-4 z-10 cursor-pointer transition-transform hover:scale-105"
              >
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop'}
                  alt={profile.name}
                  className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-white"
                />
                <div className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
              </div>

              {/* Student Name & Academic Details (Safely inside the white card below the banner) */}
              <div className="pt-3 sm:pt-3 space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{profile.name}</h1>
                  <span className="badge-enamel-green text-xs font-bold px-3 py-0.5 rounded-full">
                    Year {profile.year} Student
                  </span>
                </div>
                <p className="text-sm text-emerald-800 font-bold">{profile.course}</p>
                <p className="text-xs text-slate-500 font-medium">{profile.college}</p>
              </div>
            </div>

            {/* Right: Social & Portfolio Links */}
            <div className="flex items-center gap-2 pt-3 sm:pt-3.5">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200/90 text-slate-700 hover:text-emerald-800 transition-all hover:scale-105 shadow-2xs"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200/90 text-slate-700 hover:text-emerald-800 transition-all hover:scale-105 shadow-2xs"
                  title="Portfolio Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200/90 text-slate-700 hover:text-emerald-800 transition-all hover:scale-105 shadow-2xs"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Headline & Bio */}
          <div className="space-y-2 pt-4">
            {profile.headline && (
              <p className="text-base font-bold text-slate-800 leading-snug tracking-tight">{profile.headline}</p>
            )}
            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl whitespace-pre-line font-medium">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Availability & Interests Pills */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium">Availability: </span>
              <strong className="text-slate-900 font-bold">{profile.availability || 'Flexible for hackathons'}</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#edf4ec] text-[#274d36] border border-[#274d36]/20 shadow-2xs">
                <Orbit className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium">Interests: </span>
              <strong className="text-slate-900 font-bold">{profile.interests || 'AI, Web Development'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top Section: Skills and Match Requests Side by Side (Equal Size) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Column: Skills Showcase (Categorized & Learning Status) */}
        <div className="glass-card rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-glass-card flex flex-col justify-between h-full space-y-5">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100/90 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2 tracking-tight">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Skills & Proficiency Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Verified competencies with real-time learning statuses</p>
              </div>
            </div>

            {/* Skills Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profile.skills.map((us) => (
                <div
                  key={us.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white/90 flex flex-col justify-between space-y-3 hover:border-emerald-300 hover:shadow-tactile-subtle transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{us.skill.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60">{us.skill.category}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={statusColors[us.status] || statusColors.Comfortable}
                    >
                      {us.status}
                    </span>

                    {/* Proficiency rating bars */}
                    <div className="flex gap-1" title={`Proficiency: ${us.proficiency}/5`}>
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`w-3.5 h-2 rounded-xs transition-colors ${
                            lvl <= us.proficiency ? 'bg-emerald-600 shadow-2xs' : 'bg-slate-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gap Insights */}
          <div className="mt-6 pt-5 border-t border-slate-100/90">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Orbit className="w-4 h-4 text-[#274d36]" />
                AI Skill Gap Insights
              </h4>
              <button
                onClick={handleLoadSkillGaps}
                disabled={loadingGaps}
                className="text-xs text-emerald-800 font-bold hover:text-emerald-950 hover:underline cursor-pointer"
              >
                {loadingGaps ? 'Analyzing...' : 'Generate Guidance'}
              </button>
            </div>

            {skillGaps.length > 0 && (
              <div className="space-y-2.5 mt-3">
                {skillGaps.map((gap, i) => (
                  <div key={i} className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs space-y-1 shadow-inner">
                    <div className="font-extrabold text-emerald-950">{gap.skill}</div>
                    <p className="text-slate-600 font-medium leading-relaxed">{gap.reason}</p>
                    <a
                      href={gap.learningLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline text-[11px] pt-1"
                    >
                      Curated Learning Documentation <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Match Requests (for Profile Owner) OR Match Collaboration Card (for Visitor) */}
        {isOwner ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col h-full space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#274d36]" />
                  Requests to Match
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Teammate invitations and collaboration requests</p>
              </div>
              {profile.receivedCollab && profile.receivedCollab.filter((r) => r.status === 'pending').length > 0 && (
                <span className="text-xs font-bold text-[#1a3826] bg-[#edf4ec] border border-[#274d36]/25 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {profile.receivedCollab.filter((r) => r.status === 'pending').length} pending
                </span>
              )}
            </div>

            {profile.receivedCollab && profile.receivedCollab.length > 0 ? (
              <div className="space-y-3.5">
                {profile.receivedCollab.map((req) => {
                  const matchPercent = req.matchScore || calculatePairMatchScore(profile, {
                    domain: req.project?.domain,
                    interests: req.sender?.course,
                    availability: '15 hrs/week',
                  });

                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        req.status === 'pending'
                          ? 'border-emerald-200/90 bg-[#f4f8f4] hover:border-[#274d36]/40'
                          : req.status === 'accepted'
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/50 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={req.sender?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                            alt={req.sender?.name || 'Sender'}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-2xs"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {req.sender?.name || 'Teammate'}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {req.sender?.course || 'Student'} • {req.sender?.college}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Match Percentage Badge */}
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs whitespace-nowrap leading-tight">
                            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500 shrink-0" />
                            {matchPercent}% Match
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize whitespace-nowrap leading-tight ${
                              req.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                : req.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                : 'bg-rose-50 text-rose-700 border-rose-200/80'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Project:</span>
                          <Link
                            href={`/workspace/${req.projectId}`}
                            className="font-bold text-emerald-700 hover:underline truncate max-w-[200px]"
                          >
                            {req.project?.title}
                          </Link>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Proposed Role:</span>
                          <span className="font-semibold text-slate-800">{req.role}</span>
                        </div>
                        {req.message && (
                          <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-100/80 leading-relaxed">
                            &ldquo;{req.message}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Actions if pending */}
                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleRespondCollab(req.id, 'accepted')}
                            disabled={respondingCollabId === req.id}
                            className="flex-1 py-1.5 px-3 rounded-xl btn-gradleaf-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-tactile transition-all active:scale-[0.98]"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept Match
                          </button>
                          <button
                            onClick={() => handleRespondCollab(req.id, 'rejected')}
                            disabled={respondingCollabId === req.id}
                            className="py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-semibold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                <Inbox className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No match requests yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When other students or project leaders invite you from the Smart Matcher, their requests will appear here.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Visitor View: Match with Student Card with Match Percentage */
          <div className="bg-[#f8faf8] rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between h-full">
            <div className="border-b border-slate-200/80 pb-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#1e3c2b] uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
                  Teammate Collaboration
                </span>
                {/* Live Match Percentage Badge */}
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#edf4ec] text-[#173623] border border-[#274d36]/25 flex items-center gap-1 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-[#274d36] fill-[#274d36]/20" />
                  {currentUser
                    ? `${calculatePairMatchScore(profile, {
                        id: currentUser.id,
                        domain: currentUser.interests || currentUser.course,
                        skills: currentUser.skills,
                        interests: currentUser.interests,
                        availability: currentUser.availability,
                      })}% Match`
                    : '88% Match'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mt-2">
                <Orbit className="w-5 h-5 text-[#274d36]" />
                Match with {profile.name.split(' ')[0]}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Looking to team up with {profile.name.split(' ')[0]} for an upcoming hackathon or active project sprint? Send a direct match proposal!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Availability</div>
                  <div className="text-slate-800 font-bold">{profile.availability || 'Flexible'}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#edf4ec] flex items-center justify-center text-[#274d36] shrink-0 border border-[#274d36]/15">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Key Strengths</div>
                  <div className="text-slate-800 font-bold truncate max-w-[180px]">
                    {profile.skills?.slice(0, 3).map((s) => s.skill.name).join(', ') || 'Fullstack Tech'}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenMatchModal}
              className="w-full py-3 px-4 rounded-xl btn-gradleaf-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-tactile active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Send Match Proposal
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section: Compact Project Portfolio & Achievements (Full Width) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-emerald-700" />
              Project Portfolio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Active hackathon and student ventures</p>
          </div>

          {((profile.ownedProjects && profile.ownedProjects.length > 0) || (profile.projectMembers && profile.projectMembers.length > 0)) && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full w-fit">
              {(profile.ownedProjects?.length || 0) + (profile.projectMembers?.filter((pm: any) => !profile.ownedProjects?.some((op: any) => op.id === pm.project?.id)).length || 0)} Active {(profile.ownedProjects?.length || 0) + (profile.projectMembers?.filter((pm: any) => !profile.ownedProjects?.some((op: any) => op.id === pm.project?.id)).length || 0) === 1 ? 'Project' : 'Projects'}
            </span>
          )}
        </div>

        {(() => {
          const ownedProjects = profile.ownedProjects || [];
          const contributingProjects = (profile.projectMembers || []).filter(
            (pm: any) => pm.project && !ownedProjects.some((op: any) => op.id === pm.project.id)
          );

          return (
            <div className="space-y-6">
              {/* 1. Projects Led & Created */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-700" />
                      Projects Led & Created
                    </h4>
                    <p className="text-[11px] text-slate-500">Initiatives and hackathon ventures founded by {profile.name.split(' ')[0]}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full w-fit">
                    {ownedProjects.length} {ownedProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                {ownedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                              {proj.title}
                            </h4>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Lead
                            </span>
                          </div>

                          {proj.domain && (
                            <span className="inline-block text-[10px] font-semibold text-[#1a3826] bg-[#edf4ec] px-2 py-0.5 rounded-md border border-[#274d36]/20">
                              {proj.domain}
                            </span>
                          )}

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {proj.description}
                          </p>

                          {proj.skills && proj.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {proj.skills.slice(0, 4).map((ps: any) => (
                                <span
                                  key={ps.id}
                                  className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200/80 px-1.5 py-0.5 rounded-md"
                                >
                                  {ps.skill?.name || ps.skillId}
                                </span>
                              ))}
                              {proj.skills.length > 4 && (
                                <span className="text-[10px] font-medium text-slate-400 self-center">
                                  +{proj.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            href={`/workspace/${proj.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                          >
                            Open Workspace <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <p className="text-xs font-semibold text-slate-700">No led projects yet</p>
                    <p className="text-[11px] text-slate-400">
                      When {profile.name.split(' ')[0]} creates a project in the Marketplace, it will appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Contributing Projects (Collaborations) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Contributing Projects & Collaborations
                    </h4>
                    <p className="text-[11px] text-slate-500">External squads and peer hackathon ventures {profile.name.split(' ')[0]} contributes to</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full w-fit">
                    {contributingProjects.length} {contributingProjects.length === 1 ? 'Collaboration' : 'Collaborations'}
                  </span>
                </div>

                {contributingProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contributingProjects.map((pm: any) => (
                      <div
                        key={pm.project.id}
                        className="p-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/20 hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                              {pm.project.title}
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                              {pm.role || 'Contributor'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {pm.project.domain && (
                              <span className="inline-block text-[10px] font-semibold text-[#1a3826] bg-[#edf4ec] px-2 py-0.5 rounded-md border border-[#274d36]/20">
                                {pm.project.domain}
                              </span>
                            )}
                            {pm.project.owner && (
                              <span className="text-[11px] text-slate-500 font-medium">
                                Lead: <strong className="text-slate-700">{pm.project.owner.name}</strong>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {pm.project.description}
                          </p>

                          {pm.project.skills && pm.project.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {pm.project.skills.slice(0, 4).map((ps: any) => (
                                <span
                                  key={ps.id}
                                  className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200/80 px-1.5 py-0.5 rounded-md"
                                >
                                  {ps.skill?.name || ps.skillId}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            href={`/workspace/${pm.project.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-gradleaf-primary font-bold text-xs shadow-tactile transition-all active:scale-[0.98]"
                          >
                            Open Workspace <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <p className="text-xs font-semibold text-slate-700">No external team contributions yet</p>
                    <p className="text-[11px] text-slate-400">
                      When {profile.name.split(' ')[0]} accepts project invitations or matches with teams in the Marketplace, the active workspaces will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Hackathon Awards & Verified Badges */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Hackathon Awards & Verified Badges
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">Verified by GradLeaf Campus System</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between hover:bg-amber-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-amber-950 text-xs">Best UI/UX Design HackMIT</div>
                  <p className="text-amber-800/80 text-[11px]">GradLeaf Prototype Sprint</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                2026
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Campus Open Source Contributor</div>
                  <p className="text-slate-500 text-[11px]">5 merged PRs to student repositories</p>
                </div>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Edit Professional Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Photo Editor Section */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Profile Picture
                  </label>
                  {uploadError && <span className="text-[11px] text-rose-600 font-semibold">{uploadError}</span>}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl || profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white ring-2 ring-emerald-100 shadow-xs bg-white"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 text-slate-700 hover:text-emerald-700 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Or paste photo URL..."
                        value={avatarUrl}
                        onChange={(e) => {
                          setAvatarUrl(e.target.value);
                          setUploadError('');
                        }}
                        className="flex-1 text-xs p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">Presets:</span>
                      <div className="flex items-center gap-1.5">
                        {avatarPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAvatarUrl(preset);
                              setUploadError('');
                            }}
                            className={`w-6 h-6 rounded-lg overflow-hidden border transition-all hover:scale-110 ${
                              avatarUrl === preset ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                            }`}
                            title={`Select preset ${idx + 1}`}
                          >
                            <img src={preset} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* College Name & Degree Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. BITS Pilani"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree / Course Name
                  </label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.E. Computer Science"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Academic Year & Interests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value={1}>Year 1 Student</option>
                    <option value={2}>Year 2 Student</option>
                    <option value={3}>Year 3 Student</option>
                    <option value={4}>Year 4 Student</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Interests (Domains & Topics)
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Mobile Apps, Web Development, Cloud"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Professional Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Mobile & Cloud Builder • Flutter & Node.js"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Bio & Introduction */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Bio & Introduction
                  </label>
                  <button
                    type="button"
                    onClick={handleAIEnhanceBio}
                    disabled={isGeneratingAI}
                    className="text-[11px] font-semibold text-[#274d36] hover:text-[#173022] flex items-center gap-1"
                  >
                    <Orbit className="w-3 h-3" />
                    {isGeneratingAI ? 'Generating...' : 'Enhance with AI Assistant'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 resize-none focus:outline-none focus:border-[#274d36] leading-relaxed"
                />
              </div>

              {/* Collaboration Availability */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Collaboration Availability
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. 15 hrs/week (Flexible for hackathons)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#274d36]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white btn-gradleaf-primary rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Match with Student Modal (when viewing another user's profile) */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Orbit className="w-4 h-4 text-[#274d36]" />
                  Match with {profile.name}
                </h3>
                <p className="text-xs text-slate-500">Send an official teammate collaboration proposal</p>
              </div>
              <button
                onClick={() => setShowMatchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {matchSentSuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-emerald-900 text-sm">Match Proposal Sent!</h4>
                <p className="text-xs text-emerald-700 max-w-xs mx-auto">
                  {profile.name} has been notified in their notification center and will see this under &ldquo;Requests to Match&rdquo;.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMatchRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Your Project / Venture:
                  </label>
                  {allProjects.length > 0 ? (
                    <select
                      value={matchProjectId}
                      onChange={(e) => setMatchProjectId(e.target.value)}
                      className="neu-input w-full text-xs font-bold p-3 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {allProjects.map((p) => (
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
                    Proposed Role for {profile.name.split(' ')[0]}:
                  </label>
                  <input
                    type="text"
                    required
                    value={matchRole}
                    onChange={(e) => setMatchRole(e.target.value)}
                    placeholder="e.g. Backend Lead, AI Specialist, UI Designer"
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
                    href={`/matching${matchProjectId ? `?projectId=${matchProjectId}&candidateId=${profile.id}` : `?candidateId=${profile.id}`}`}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Orbit className="w-3.5 h-3.5 text-[#274d36]" /> Open in Smart Matcher
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMatchModal(false)}
                      className="btn-gradleaf-secondary px-4 py-2.5 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingMatch || allProjects.length === 0}
                      className="btn-gradleaf-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl shadow-tactile cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {sendingMatch ? 'Sending...' : 'Send Match Proposal'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Enlarged Profile Picture Lightbox Modal */}
      {showEnlargedAvatar && profile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowEnlargedAvatar(false)}
        >
          <div
            className="relative bg-white/10 p-2 sm:p-3 rounded-3xl border border-white/20 shadow-2xl max-w-md w-full flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowEnlargedAvatar(false)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-9 h-9 bg-slate-900/90 text-white rounded-full flex items-center justify-center border border-white/20 shadow-lg hover:bg-slate-800 transition-colors z-20"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-Resolution Image */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop'}
                alt={profile.name}
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* Profile Caption Info */}
            <div className="w-full pt-3 pb-1 px-2 text-center text-white">
              <h3 className="font-bold text-lg tracking-tight">{profile.name}</h3>
              <p className="text-xs text-emerald-200 font-medium mt-0.5">
                {profile.course} &bull; {profile.college}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
