'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import {
  Briefcase,
  Plus,
  Search,
  Orbit,
  Users,
  Calendar,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  X,
  Send,
  Upload,
  Github,
  Globe,
  Award,
  Zap,
  Clock,
  ChevronRight,
  Shield,
  Layers,
  MessageSquare,
  UserCheck,
  User,
  GraduationCap,
  RotateCcw,
  Check,
} from 'lucide-react';
import { calculatePairMatchScore } from '@/lib/matchingAlgorithm';

interface ProjectMemberType {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
    college?: string;
    course?: string;
    year?: number;
    department?: string | null;
  };
}

interface ProjectSkillType {
  id: string;
  role: string | null;
  priority: string;
  skill: { name: string; category: string };
}

interface ProjectType {
  id: string;
  title: string;
  tagline?: string | null;
  description: string;
  domain: string;
  imageUrl?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  deadline: string | null;
  status: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    avatarUrl: string | null;
    college: string;
    course?: string;
    year?: number;
  };
  skills: ProjectSkillType[];
  members: ProjectMemberType[];
  tasks?: any[];
}

const projectCoverPresets = [
  { name: 'AI & Neural Labs', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Full-Stack Web App', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mobile App Experience', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80' },
  { name: 'FinTech & Analytics', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cloud & Distributed', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  { name: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
];

function buildElevatorPitch(project: ProjectType, role: string, user?: any): string {
  const leadFirstName = project.owner.name.split(' ')[0];
  const r = role.toLowerCase().trim();

  // Find if user has a matching verified/listed skill
  const matchingUserSkill = user?.skills?.find((s: any) => {
    const sName = s.skill?.name?.toLowerCase() || '';
    return r.includes(sName) || (sName.length > 2 && r.includes(sName.slice(0, 4)));
  });

  let expertiseDetail = '';
  if (
    r.includes('database') ||
    r.includes('data') ||
    r.includes('sql') ||
    r.includes('schema') ||
    r.includes('sync') ||
    r.includes('postgres') ||
    r.includes('storage')
  ) {
    expertiseDetail = `I have strong background in database schema design, offline-first sync protocols, indexing, and dependable data pipelines${matchingUserSkill ? ` (hands-on with ${matchingUserSkill.skill.name})` : ''}.`;
  } else if (
    r.includes('frontend') ||
    r.includes('ui') ||
    r.includes('ux') ||
    r.includes('web') ||
    r.includes('react') ||
    r.includes('tailwind')
  ) {
    expertiseDetail = `I have solid experience building responsive user interfaces, modular components, and fluid client-side state interactions${matchingUserSkill ? ` (hands-on with ${matchingUserSkill.skill.name})` : ''}.`;
  } else if (
    r.includes('backend') ||
    r.includes('api') ||
    r.includes('server') ||
    r.includes('node') ||
    r.includes('fastapi')
  ) {
    expertiseDetail = `I bring experience architecting scalable REST/WebSocket APIs, backend services, and clean system logic${matchingUserSkill ? ` (hands-on with ${matchingUserSkill.skill.name})` : ''}.`;
  } else if (
    r.includes('ai') ||
    r.includes('ml') ||
    r.includes('machine learning') ||
    r.includes('model') ||
    r.includes('nlp') ||
    r.includes('pytorch') ||
    r.includes('langchain')
  ) {
    expertiseDetail = `I have hands-on experience developing ML/AI pipelines, fine-tuning models, and integrating intelligent features${matchingUserSkill ? ` (skilled in ${matchingUserSkill.skill.name})` : ''}.`;
  } else if (
    r.includes('mobile') ||
    r.includes('ios') ||
    r.includes('android') ||
    r.includes('flutter') ||
    r.includes('react native')
  ) {
    expertiseDetail = `I have deep experience with mobile app development, smooth native interactions, and responsive UI${matchingUserSkill ? ` (hands-on with ${matchingUserSkill.skill.name})` : ''}.`;
  } else if (r.includes('design') || r.includes('figma') || r.includes('product')) {
    expertiseDetail = `I bring strong capabilities in design systems, high-fidelity prototypes in Figma, and intuitive UX flows.`;
  } else if (r.includes('devops') || r.includes('cloud') || r.includes('docker') || r.includes('infra')) {
    expertiseDetail = `I have experience with containerization, deployment pipelines, and reliable cloud infrastructure.`;
  } else {
    expertiseDetail = `I have a relevant technical background and flexible weekly hours ready to build with your team.`;
  }

  return `Hi ${leadFirstName}! I'd love to join "${project.title}" as ${role}. ${expertiseDetail} I'm excited to collaborate and start building together!`;
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const targetProjectId = searchParams.get('id') || searchParams.get('project');
  const { currentUser, refreshUsers } = useUser();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');

  // Modal 1: Project Details Modal
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  // Modal 2: Ask to Match / Apply Modal
  const [applyProject, setApplyProject] = useState<ProjectType | null>(null);
  const [applyRole, setApplyRole] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [sendingApply, setSendingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Modal 3: Create Project Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDomain, setNewDomain] = useState('AI & Machine Learning');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-11-20');
  const [newDemoUrl, setNewDemoUrl] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newStatus, setNewStatus] = useState('recruiting');
  const [roles, setRoles] = useState<{ roleTitle: string; skillName: string; category: string }[]>([
    { roleTitle: 'Frontend Engineer', skillName: 'React', category: 'Frontend' },
    { roleTitle: 'Backend Engineer', skillName: 'FastAPI', category: 'Backend' },
  ]);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleSkill, setNewRoleSkill] = useState('');
  const [isExtractingAI, setIsExtractingAI] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // When navigated with ?id=... (e.g. from Skill Graph), auto-select and open that specific project
  useEffect(() => {
    if (!targetProjectId || projects.length === 0) return;
    const target = projects.find((p) => p.id === targetProjectId);
    if (target) {
      setSelectedProject(target);
      setDomainFilter('All');
    }
  }, [targetProjectId, projects]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image size exceeds 4MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewImageUrl(reader.result as string);
      setUploadError('');
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleAIExtract = async () => {
    if (!newDescription.trim()) return;
    setIsExtractingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extract_roles', input: newDescription }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.roles && data.roles.length > 0) {
          setRoles(data.roles);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtractingAI(false);
    }
  };

  const handleAddCustomRole = () => {
    if (!newRoleTitle.trim() || !newRoleSkill.trim()) return;
    setRoles([...roles, { roleTitle: newRoleTitle.trim(), skillName: newRoleSkill.trim(), category: 'General' }]);
    setNewRoleTitle('');
    setNewRoleSkill('');
  };

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const errors: { [key: string]: string } = {};
    if (!newTitle.trim()) errors.title = 'Project title is mandatory';
    if (!newTagline.trim()) errors.tagline = 'Elevator pitch / tagline is mandatory';
    if (!newDescription.trim()) errors.description = 'Project problem statement and description is mandatory';
    if (roles.length === 0) errors.roles = 'Please specify at least 1 required role or skill';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCreating(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          tagline: newTagline.trim(),
          description: newDescription.trim(),
          domain: newDomain,
          imageUrl: newImageUrl.trim() || null,
          demoUrl: newDemoUrl.trim() || null,
          repoUrl: newRepoUrl.trim() || null,
          status: newStatus,
          deadline: newDeadline || null,
          ownerId: currentUser.id,
          roles,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewTagline('');
        setNewDescription('');
        setNewImageUrl('');
        setNewDemoUrl('');
        setNewRepoUrl('');
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenApplyModal = (project: ProjectType, roleTitle?: string) => {
    setApplyProject(project);
    const targetRole = roleTitle || project.skills?.[0]?.role || project.skills?.[0]?.skill?.name || 'Collaborator';
    setApplyRole(targetRole);
    setApplyMessage(buildElevatorPitch(project, targetRole, currentUser));
    setApplySuccess(false);
  };

  const handleSelectRole = (newRole: string) => {
    setApplyRole(newRole);
    if (applyProject) {
      setApplyMessage(buildElevatorPitch(applyProject, newRole, currentUser));
    }
  };

  const handleRoleInputChange = (newRole: string) => {
    setApplyRole(newRole);
    if (!applyProject) return;

    setApplyMessage((prev) => {
      const leadFirstName = applyProject.owner.name.split(' ')[0];
      if (
        prev.includes(`I'd love to join "${applyProject.title}" as`) ||
        prev.startsWith(`Hi ${leadFirstName}!`)
      ) {
        return buildElevatorPitch(applyProject, newRole.trim() || 'Collaborator', currentUser);
      }
      return prev;
    });
  };

  const handleSendCollabRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !applyProject) return;
    setSendingApply(true);
    try {
      const res = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: applyProject.id,
          senderId: currentUser.id,
          receiverId: applyProject.owner.id,
          role: applyRole,
          message: applyMessage,
        }),
      });
      if (res.ok) {
        setApplySuccess(true);
        refreshUsers();
        setTimeout(() => {
          setApplyProject(null);
          setApplySuccess(false);
        }, 1800);
      }
    } catch (e) {
      console.error('Failed to send collab request', e);
    } finally {
      setSendingApply(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (targetProjectId && !search.trim()) {
      return p.id === targetProjectId;
    }

    const q = search.trim().toLowerCase();
    const matchesDomain = domainFilter === 'All' || p.domain === domainFilter;
    if (!q) return matchesDomain;

    const tokens = q.split(/\s+/).filter(Boolean);

    const matchesSearch = tokens.every((token) => {
      if (p.title.toLowerCase().includes(token)) return true;
      if (p.tagline && p.tagline.toLowerCase().includes(token)) return true;
      if (p.domain.toLowerCase().includes(token)) return true;
      if (p.owner.name.toLowerCase().includes(token)) return true;
      if (p.members?.some((m) => m.user.name.toLowerCase().includes(token))) return true;

      const skillMatches = p.skills.some((ps) => {
        const sName = ps.skill.name.toLowerCase();
        if (sName.startsWith(token)) return true;
        const role = (ps.role || '').toLowerCase();
        if (role.includes(token)) return true;
        return false;
      });
      if (skillMatches) return true;

      if (token.length >= 3) {
        const descWords = p.description.toLowerCase().split(/[\s,.\-&/()]+/).filter(Boolean);
        if (descWords.some((w) => w.startsWith(token) || (token.length >= 5 && w.includes(token)))) return true;
      }

      return false;
    });

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-glass-card">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold mb-2 shadow-2xs">
            <Orbit className="w-3.5 h-3.5 text-emerald-600" />
            GradLeaf Venture Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Project & Hackathon Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Discover active campus ventures, review team members and open technical roles, text project creators, and recruit collaborators.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-gradleaf-primary flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs self-start sm:self-auto shrink-0 shadow-tactile active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Target Project Filter Notice */}
      {targetProjectId && !search.trim() && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Orbit className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                Focused View: {projects.find((p) => p.id === targetProjectId)?.title || 'Selected Project'}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                Showing this specific project selected from the Campus Skill Graph.
              </p>
            </div>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all shadow-2xs shrink-0"
          >
            Show All Projects
          </Link>
        </div>
      )}

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 glass-panel p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by tech, title, lead, or role..."
            className="neu-input w-full text-xs pl-10 pr-9 py-2.5 rounded-xl transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'AI & Machine Learning', 'Web Development', 'FinTech', 'Mobile Apps'].map((d) => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`text-xs px-3.5 py-1.5 rounded-xl transition-all ${
                domainFilter === d
                  ? 'btn-gradleaf-primary font-bold shadow-xs'
                  : 'btn-gradleaf-secondary font-semibold'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-bold text-slate-700">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} available
          {targetProjectId && !search.trim() && (
            <span className="text-emerald-700 font-semibold ml-2">
              (Filtered to project from Skill Graph)
            </span>
          )}
        </span>
        {(search.trim() !== '' || domainFilter !== 'All' || targetProjectId) && (
          <Link
            href="/projects"
            onClick={() => {
              setSearch('');
              setDomainFilter('All');
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset search & show all
          </Link>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse h-72"></div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search.trim()
              ? `No projects matched "${search.trim()}" in ${domainFilter === 'All' ? 'any domain' : domainFilter}.`
              : 'No projects currently listed in this category.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setDomainFilter('All');
            }}
            className="btn-gradleaf-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-tactile active:scale-95 transition-all"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isOwner = currentUser?.id === project.ownerId;
            const isMember = project.members?.some((m) => m.user.id === currentUser?.id);
            const userMatchScore = currentUser && !isMember
              ? calculatePairMatchScore(currentUser, {
                  domain: project.domain,
                  skills: project.skills,
                  interests: project.domain,
                })
              : null;

            return (
              <div
                key={project.id}
                className="glass-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4 group"
              >
                {/* Card Top: Image/Banner (if exists) + Header Tags */}
                <div className="space-y-3.5">
                  {project.imageUrl && (
                    <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {project.domain}
                        </span>
                        {project.deadline && (
                          <span className="text-[10px] font-medium bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-300" />
                            {project.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Top Badges row if no image */}
                  {!project.imageUrl && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-50/90 border border-emerald-200/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        {project.domain}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 capitalize">
                        {project.status === 'in_progress' ? 'Building' : project.status}
                      </span>
                    </div>
                  )}

                  {/* Title & Tagline/Description */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => setSelectedProject(project)}
                        className="font-extrabold text-slate-900 text-lg sm:text-xl hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
                      >
                        {project.title}
                      </h3>
                      {userMatchScore !== null && (
                        <span
                          className={`shrink-0 text-xs font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-2xs ${
                            userMatchScore >= 80
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                          title="Your personal compatibility score with this project"
                        >
                          <Zap className="w-3 h-3 fill-current text-emerald-600" />
                          {userMatchScore}% Fit
                        </span>
                      )}
                    </div>
                    {project.tagline && (
                      <p className="text-xs text-emerald-800 font-bold mt-1">
                        {project.tagline}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* 1. Project Creator / Lead (Clear visibility of who is running it) */}
                  <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Link href={`/profile/${project.owner.id}`} className="shrink-0">
                        <img
                          src={project.owner.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                          alt={project.owner.name}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/20 shadow-2xs hover:opacity-85 transition-opacity"
                        />
                      </Link>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/profile/${project.owner.id}`}
                            className="text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors truncate"
                          >
                            {project.owner.name}
                          </Link>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Lead
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{project.owner.college}</p>
                      </div>
                    </div>

                    {!isOwner && (
                      <button
                        onClick={() => handleOpenApplyModal(project)}
                        className="btn-gradleaf-secondary px-2.5 py-1 text-[11px] font-bold rounded-xl shrink-0 flex items-center gap-1 active:scale-95"
                        title="Direct message project lead"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        Message Lead
                      </button>
                    )}
                  </div>

                  {/* 2. Team Members Roster: who is working on what */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        Active Team ({project.members?.length || 1}):
                      </span>
                      <span className="text-slate-400">
                        {project.members?.length} {project.members?.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.members?.map((m) => (
                        <Link
                          key={m.id}
                          href={`/profile/${m.user.id}`}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs transition-all shadow-2xs"
                        >
                          <img
                            src={m.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop'}
                            alt={m.user.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-800 text-[11px]">{m.user.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({m.role})</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* 3. Open Roles Needed */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        Looking for Roles:
                      </span>
                      <span className="text-emerald-700 font-bold text-[11px]">
                        {project.skills?.length || 0} open positions
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.skills?.map((ps) => (
                        <div
                          key={ps.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-xs shadow-2xs"
                        >
                          <span className="font-bold text-slate-800 text-[11px]">
                            {ps.role || ps.skill.name}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/70">
                            {ps.skill.name}
                          </span>
                          {!isOwner && !isMember && (
                            <button
                              onClick={() => handleOpenApplyModal(project, ps.role || ps.skill.name)}
                              className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200 px-2 py-0.5 rounded-md ml-0.5 transition-colors border border-emerald-300/60"
                              title="Apply for this role"
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn-gradleaf-secondary text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-2">
                    {!isOwner && !isMember && (
                      <button
                        onClick={() => handleOpenApplyModal(project)}
                        className="btn-gradleaf-primary flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-tactile active:scale-95"
                      >
                        <Orbit className="w-3.5 h-3.5" />
                        Ask to Match
                      </button>
                    )}

                    {(isOwner || isMember) && (
                      <Link
                        href={`/workspace/${project.id}`}
                        className="btn-gradleaf-dark flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-tactile-dark active:scale-95"
                      >
                        Workspace <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Full Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedProject.domain}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 capitalize">
                    {selectedProject.status === 'in_progress' ? 'Building' : selectedProject.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {selectedProject.title}
                </h2>
                {selectedProject.tagline && (
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    {selectedProject.tagline}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Cover Image if present */}
            {selectedProject.imageUrl && (
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Overview / Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Problem Statement & Architecture:
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {selectedProject.description}
              </p>
            </div>

            {/* Deadline & External Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target / Hackathon Deadline</span>
                  <span className="font-bold text-slate-800">{selectedProject.deadline || 'Flexible timeline'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Repository / Demo</span>
                    <span className="font-bold text-slate-800 truncate max-w-[140px] block">
                      {selectedProject.repoUrl ? 'GitHub Connected' : 'Not linked'}
                    </span>
                  </div>
                </div>
                {selectedProject.repoUrl && (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Team Roster: who is working on what */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Active Team Members ({selectedProject.members?.length || 1}):
                </h4>
                <span className="text-xs text-slate-400">Click any member to inspect profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedProject.members?.map((m) => (
                  <Link
                    key={m.id}
                    href={`/profile/${m.user.id}`}
                    className="p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-300 bg-white hover:bg-emerald-50/30 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={m.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                        alt={m.user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                          {m.user.name}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold">{m.role}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Open Roles & Skills Needed */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Roles Needed & Requirements:
              </h4>

              <div className="space-y-2">
                {selectedProject.skills?.map((ps) => (
                  <div
                    key={ps.id}
                    className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#edf4ec] text-[#21442f] border border-[#274d36]/20 flex items-center justify-center font-bold text-xs shadow-2xs">
                        <Orbit className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {ps.role || 'Teammate Role'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>Required Proficiency:</span>
                          <span className="font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[11px]">
                            {ps.skill.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {currentUser?.id !== selectedProject.ownerId && (
                      <button
                        onClick={() => {
                          const p = selectedProject;
                          setSelectedProject(null);
                          handleOpenApplyModal(p, ps.role || ps.skill.name);
                        }}
                        className="btn-gradleaf-primary px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-tactile active:scale-95 transition-all"
                      >
                        Apply for this Role
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {(() => {
                const isSelectedOwner = currentUser?.id === selectedProject.ownerId;
                const isSelectedMember = selectedProject.members?.some(
                  (m: any) => m.userId === currentUser?.id || m.user?.id === currentUser?.id
                );
                const hasAccess = isSelectedOwner || isSelectedMember;

                return hasAccess ? (
                  <Link
                    href={`/workspace/${selectedProject.id}`}
                    className="btn-gradleaf-dark flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl shadow-tactile-dark transition-all"
                  >
                    Open Team Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Private team workspace • Members only
                  </span>
                );
              })()}

              <div className="flex items-center gap-2">
                {currentUser?.id !== selectedProject.ownerId &&
                  !selectedProject.members?.some(
                    (m: any) => m.userId === currentUser?.id || m.user?.id === currentUser?.id
                  ) && (
                    <button
                      onClick={() => {
                        const p = selectedProject;
                        setSelectedProject(null);
                        handleOpenApplyModal(p);
                      }}
                      className="btn-gradleaf-primary flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl shadow-tactile transition-all active:scale-95"
                    >
                      <Orbit className="w-3.5 h-3.5" />
                      Ask to Match & Join Team
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ask to Match / Text Project Lead Modal */}
      {applyProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Orbit className="w-4.5 h-4.5 text-emerald-600" />
                  Ask to Match & Join Team
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Message the project creator directly with your proposed role & pitch
                </p>
              </div>
              <button
                onClick={() => setApplyProject(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
                  ✓
                </div>
                <h4 className="font-bold text-emerald-900 text-sm">Match Request Delivered!</h4>
                <p className="text-xs text-emerald-700 max-w-xs mx-auto">
                  {applyProject.owner.name} has been notified and can review your application under &ldquo;Requests to Match&rdquo;.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendCollabRequest} className="space-y-4">
                {/* Project & Creator Card */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={applyProject.owner.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                      alt={applyProject.owner.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                        Project Lead
                      </div>
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {applyProject.owner.name}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{applyProject.owner.college}</p>
                    </div>
                  </div>

                  <Link
                    href={`/profile/${applyProject.owner.id}`}
                    target="_blank"
                    className="btn-gradleaf-secondary text-[11px] font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl shadow-2xs shrink-0"
                  >
                    View Profile <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Target Role selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Position / Role you are applying for:
                  </label>
                  <input
                    type="text"
                    required
                    value={applyRole}
                    onChange={(e) => handleRoleInputChange(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Database Engineer, ML Specialist"
                    className="neu-input w-full text-xs font-medium p-2.5 rounded-xl"
                  />
                  {applyProject.skills?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-400 font-medium">Quick select:</span>
                      {applyProject.skills.map((s) => {
                        const roleName = s.role || s.skill.name;
                        const isSelected =
                          applyRole.trim().toLowerCase() === roleName.trim().toLowerCase();
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelectRole(roleName)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg transition-all ${
                              isSelected
                                ? 'btn-gradleaf-primary font-bold shadow-xs scale-[1.03]'
                                : 'btn-gradleaf-secondary font-semibold text-slate-700'
                            }`}
                          >
                            {isSelected && '✓ '}
                            {roleName}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Message input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Personalized Message / Elevator Pitch to {applyProject.owner.name.split(' ')[0]}:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (applyProject) {
                          setApplyMessage(
                            buildElevatorPitch(applyProject, applyRole.trim() || 'Contributor', currentUser)
                          );
                        }
                      }}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
                      title="Re-tailor pitch for current role"
                    >
                      <Orbit className="w-3 h-3 text-emerald-600" />
                      Auto-tailor Pitch
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="Introduce yourself, mention why your skills match the project, and share your availability or GitHub link..."
                    className="neu-input w-full text-xs p-3 rounded-xl resize-none leading-relaxed"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setApplyProject(null)}
                    className="btn-gradleaf-secondary px-4 py-2 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingApply}
                    className="btn-gradleaf-primary flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl shadow-tactile active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingApply ? 'Sending...' : 'Send Match Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Complete Project Creation Submission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                  Launch New Project Initiative
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define project goals, upload mockups, and recruit peers with verified technical skills
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              {/* Mandatory: 1. Title & Tagline */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Title <span className="text-rose-500">*</span>
                    </label>
                    {formErrors.title && <span className="text-[11px] text-rose-600 font-semibold">{formErrors.title}</span>}
                  </div>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
                    }}
                    placeholder="e.g. AI-Powered Campus Assistant"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Elevator Pitch / Tagline <span className="text-rose-500">*</span>
                    </label>
                    {formErrors.tagline && <span className="text-[11px] text-rose-600 font-semibold">{formErrors.tagline}</span>}
                  </div>
                  <input
                    type="text"
                    required
                    value={newTagline}
                    onChange={(e) => {
                      setNewTagline(e.target.value);
                      if (formErrors.tagline) setFormErrors({ ...formErrors, tagline: '' });
                    }}
                    placeholder="e.g. Real-time syllabus parsing & automated study-group matcher"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Mandatory: 2. Domain & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Domain / Tech Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Stage / Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="recruiting">Recruiting Teammates (Open)</option>
                    <option value="in_progress">Building / Sprint in Progress</option>
                    <option value="completed">Completed / Demo Ready</option>
                  </select>
                </div>
              </div>

              {/* Mandatory: 3. Problem Statement & Detailed Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    Detailed Problem Statement & Solution <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAIExtract}
                    disabled={isExtractingAI || !newDescription.trim()}
                    className="text-[11px] text-[#21442f] hover:text-[#173022] font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Orbit className="w-3 h-3" />
                    {isExtractingAI ? 'Analyzing...' : 'AI Auto-Detect Roles'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => {
                    setNewDescription(e.target.value);
                    if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                  }}
                  placeholder="Describe the problem, technical stack choices, solution architecture, and what your team aims to accomplish during the hackathon..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none leading-relaxed"
                />
              </div>

              {/* 4. Cover Image Upload & Presets */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider">
                    Project Cover / Mockup Image
                  </label>
                  {uploadError && <span className="text-[11px] text-rose-600 font-semibold">{uploadError}</span>}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  {newImageUrl ? (
                    <div className="relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewImageUrl('')}
                        className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5 hover:bg-slate-900"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="shrink-0 w-24 h-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px]">
                      No Image
                    </div>
                  )}

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
                        placeholder="Or paste image URL (e.g. Unsplash, Imgur)..."
                        value={newImageUrl}
                        onChange={(e) => {
                          setNewImageUrl(e.target.value);
                          setUploadError('');
                        }}
                        className="flex-1 text-xs p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">Presets:</span>
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {projectCoverPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNewImageUrl(preset.url);
                              setUploadError('');
                            }}
                            className={`w-7 h-5 rounded-md overflow-hidden border transition-all hover:scale-110 shrink-0 ${
                              newImageUrl === preset.url ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                            }`}
                            title={preset.name}
                          >
                            <img src={preset.url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Target Deadline & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target / Event Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GitHub Repo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Live Demo / Figma (Optional)
                  </label>
                  <input
                    type="url"
                    value={newDemoUrl}
                    onChange={(e) => setNewDemoUrl(e.target.value)}
                    placeholder="https://demo.app..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Mandatory: 6. Open Positions & Skills Needed */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider">
                      Required Roles & Technical Stack <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      These roles determine match scores in the Smart Match AI engine
                    </span>
                  </div>
                  {formErrors.roles && <span className="text-[11px] text-rose-600 font-semibold">{formErrors.roles}</span>}
                </div>

                {/* Current Roles List */}
                <div className="space-y-2">
                  {roles.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{r.roleTitle}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 text-[11px]">
                          {r.skillName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(i)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove role"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Role Sub-Form */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-200/60">
                  <input
                    type="text"
                    placeholder="Role Title (e.g. AI Engineer)"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="neu-input w-full sm:w-1/2 p-2 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Key Skill (e.g. PyTorch, React)"
                    value={newRoleSkill}
                    onChange={(e) => setNewRoleSkill(e.target.value)}
                    className="neu-input w-full sm:w-1/2 p-2 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRole}
                    className="btn-gradleaf-dark w-full sm:w-auto px-4 py-2 font-bold text-xs rounded-xl shrink-0"
                  >
                    + Add Role
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-gradleaf-secondary px-4 py-2 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-gradleaf-primary px-6 py-2.5 text-xs font-bold rounded-xl shadow-tactile active:scale-[0.98]"
                >
                  {creating ? 'Publishing Initiative...' : 'Publish Project to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Loading Project Marketplace...</p>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
