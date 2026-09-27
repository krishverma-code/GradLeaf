'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Users,
  Calendar,
  Orbit,
  ArrowLeft,
  ChevronRight,
  Shield,
  Layers,
  Send,
  UserPlus,
  User,
  ExternalLink,
} from 'lucide-react';

interface TaskType {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeName: string | null;
}

interface CollabReqType {
  id: string;
  role: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  sender: { id: string; name: string; avatarUrl: string | null; course: string };
  receiver: { id: string; name: string; avatarUrl: string | null };
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  domain: string;
  deadline: string | null;
  status: string;
  ownerId: string;
  owner: { id: string; name: string; avatarUrl: string | null; college: string };
  skills: { id: string; role: string | null; skill: { name: string } }[];
  members: { id: string; role: string; user: { id: string; name: string; avatarUrl: string | null; course: string } }[];
  tasks: TaskType[];
  collabReqs: CollabReqType[];
}

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const { currentUser } = useUser();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [userWorkspaces, setUserWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);

  // 1. Fetch available workspaces for currentUser (owned or contributed)
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserWorkspaces = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const allProjects = await res.json();
          const mine = allProjects.filter(
            (p: any) =>
              p.ownerId === currentUser.id ||
              p.members?.some((m: any) => m.userId === currentUser.id || m.user?.id === currentUser.id)
          );
          setUserWorkspaces(mine);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserWorkspaces();
  }, [currentUser?.id]);

  // 2. Fetch project details
  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        if (data.members && data.members.length > 0 && !taskAssignee) {
          setTaskAssignee(data.members[0].user.name);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    if (!project) return;
    // Optimistic update
    setProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    });

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
      fetchProject();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;
    // Optimistic deletion
    setProject({
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
    });

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete task', e);
      fetchProject();
    }
  };

  const handleClearAllDoneTasks = async () => {
    if (!project || doneTasks.length === 0) return;
    const taskIdsToDelete = doneTasks.map((t) => t.id);

    // Optimistic deletion
    setProject({
      ...project,
      tasks: project.tasks.filter((t) => t.status !== 'done'),
    });

    try {
      await Promise.all(
        taskIdsToDelete.map((id) =>
          fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
          })
        )
      );
    } catch (e) {
      console.error('Failed to clear done tasks', e);
      fetchProject();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !projectId) return;
    setCreatingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          assigneeName: taskAssignee || currentUser?.name,
          status: 'todo',
        }),
      });
      if (res.ok) {
        setTaskTitle('');
        setTaskDesc('');
        setShowNewTaskModal(false);
        fetchProject();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingTask(false);
    }
  };

  const handleRespondCollab = async (collabId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/collab/${collabId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Workspace...</div>;
  }

  if (!project) {
    return <div className="p-8 text-center text-rose-500">Project not found.</div>;
  }

  const isMemberOrOwner = Boolean(
    currentUser &&
      (project.ownerId === currentUser.id ||
        project.members?.some(
          (m: any) => m.userId === currentUser.id || m.user?.id === currentUser.id
        ))
  );

  if (currentUser && !isMemberOrOwner) {
    return (
      <div className="max-w-xl mx-auto my-16 glass-card rounded-3xl p-8 sm:p-10 text-center shadow-glass-card border border-slate-200/80 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-300/40 flex items-center justify-center text-amber-700 shadow-tactile-subtle">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/50 shadow-2xs">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">Private Team Workspace</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
            You are not enrolled as a member of <strong className="text-slate-900 font-semibold">{project.title}</strong>. Workspace boards, tasks, and collaboration pipelines are private to project leads and verified team members.
          </p>
        </div>

        <div className="pt-3 flex items-center justify-center gap-3">
          <Link
            href="/projects"
            className="btn-gradleaf-secondary px-5 py-2.5 text-xs font-bold rounded-xl"
          >
            Explore Projects
          </Link>
          {userWorkspaces.length > 0 && (
            <Link
              href={`/workspace/${userWorkspaces[0].id}`}
              className="btn-gradleaf-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-tactile"
            >
              Go to My Workspace
            </Link>
          )}
        </div>
      </div>
    );
  }

  const todoTasks = project.tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = project.tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = project.tasks.filter((t) => t.status === 'done');
  const totalTasks = project.tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  const priorityBadges = {
    high: 'bg-rose-50 text-rose-700 border-rose-200/80 shadow-2xs',
    medium: 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-2xs',
    low: 'bg-slate-100 text-slate-600 border-slate-200/80 shadow-2xs',
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-glass-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800 mb-1.5">
              <Link href="/projects" className="flex items-center gap-1 hover:text-emerald-950 font-bold transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
              </Link>
              <span className="text-slate-300">•</span>
              <span className="uppercase tracking-wider font-bold text-slate-600">{project.domain}</span>
              {/* User role badge in this project */}
              {project.ownerId === currentUser?.id ? (
                <span className="badge-enamel-green inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                  Lead Workspace
                </span>
              ) : project.members?.some((m) => m.user?.id === currentUser?.id) ? (
                <span className="badge-enamel-green inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  Contributor ({project.members.find((m) => m.user?.id === currentUser?.id)?.role})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Guest Preview
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{project.title}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{project.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Workspace Switcher */}
            {userWorkspaces.length > 0 && (
              <div className="flex items-center gap-2 bg-white/90 border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-tactile-subtle">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Board:
                </label>
                <select
                  value={projectId}
                  onChange={(e) => router.push(`/workspace/${e.target.value}`)}
                  className="text-xs font-bold text-emerald-950 bg-transparent focus:outline-none cursor-pointer max-w-[190px] truncate"
                >
                  {userWorkspaces.map((w: any) => {
                    const isLead = w.ownerId === currentUser?.id;
                    return (
                      <option key={w.id} value={w.id}>
                        {w.title} ({isLead ? 'Lead' : 'Contributor'})
                      </option>
                    );
                  })}
                  {!userWorkspaces.some((w: any) => w.id === projectId) && (
                    <option value={project.id}>
                      {project.title} (Guest)
                    </option>
                  )}
                </select>
              </div>
            )}

            <Link
              href={`/matching`}
              className="btn-gradleaf-secondary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Orbit className="w-3.5 h-3.5 text-emerald-600" />
              Recruit with AI
            </Link>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="btn-gradleaf-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-tactile cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Milestone Progress & Team Roster Bar */}
        <div className="pt-4 border-t border-slate-100/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Sprint Progress</span>
              <span className="font-extrabold text-emerald-700">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100/90 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Members */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team:</span>
            <div className="flex flex-wrap gap-2">
              {project.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-1.5 bg-white/90 border border-slate-200/90 px-3 py-1 rounded-xl text-xs shadow-2xs"
                >
                  <img
                    src={m.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop'}
                    alt={m.user.name}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-500/20"
                  />
                  <span className="font-bold text-slate-800">{m.user.name}</span>
                  <span className="text-[10px] font-semibold text-emerald-700">({m.role})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Requests Banner (if any pending) */}
      {project.collabReqs && project.collabReqs.length > 0 && (
        <div className="glass-card border border-amber-200/90 rounded-3xl p-5 space-y-4 shadow-glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-700" />
              Collaboration Requests & Invitations ({project.collabReqs.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {project.collabReqs.map((req) => (
              <div
                key={req.id}
                className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 flex items-start justify-between gap-3 text-xs shadow-tactile-subtle"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {req.sender.name} ➔ {req.receiver.name}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-bold mt-0.5">Role: {req.role}</div>
                  {req.message && <p className="text-slate-600 mt-1 italic">&quot;{req.message}&quot;</p>}
                  <span
                    className={`inline-block mt-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-2xs ${
                      req.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : req.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {req.status === 'pending' && currentUser && (currentUser.id === req.receiver.id || currentUser.id === project.owner.id) && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleRespondCollab(req.id, 'accepted')}
                      className="btn-gradleaf-primary px-3 py-1.5 text-[11px] font-bold rounded-xl shadow-tactile cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondCollab(req.id, 'rejected')}
                      className="btn-gradleaf-secondary px-3 py-1.5 text-[11px] font-bold rounded-xl cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: To Do */}
        <div className="glass-card border border-slate-200/80 rounded-3xl p-5 flex flex-col min-h-[480px] shadow-glass-card">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">To Do</h3>
              <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold shadow-2xs">
                {todoTasks.length}
              </span>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="text-slate-500 hover:text-emerald-700 text-xs font-semibold p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/95 p-4 rounded-2xl border border-slate-200/80 shadow-tactile-subtle hover:border-emerald-300 hover:shadow-tactile transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                      priorityBadges[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                      className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 shadow-2xs"
                    >
                      Start <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100/80">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{task.assigneeName || 'Unassigned'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="glass-card border border-emerald-200/60 rounded-3xl p-5 flex flex-col min-h-[480px] shadow-glass-card bg-emerald-50/20">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-emerald-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">In Progress</h3>
              <span className="text-xs bg-emerald-100/70 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold shadow-2xs">
                {inProgressTasks.length}
              </span>
            </div>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/95 p-4 rounded-2xl border border-emerald-200/90 shadow-tactile-subtle hover:border-emerald-400 hover:shadow-tactile transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                      priorityBadges[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                      className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'done')}
                      className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-0.5 rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      Complete <CheckCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100/80">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{task.assigneeName || 'Unassigned'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Done */}
        <div className="glass-card border border-teal-200/60 rounded-3xl p-5 flex flex-col min-h-[480px] shadow-glass-card bg-teal-50/20">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-teal-100/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Done</h3>
              <span className="text-xs bg-teal-100/70 border border-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-bold shadow-2xs">
                {doneTasks.length}
              </span>
            </div>
            {doneTasks.length > 0 && (
              <button
                onClick={handleClearAllDoneTasks}
                title="Delete all completed tasks"
                className="text-[11px] font-bold text-rose-700 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 border border-rose-200/70 bg-white/80 shadow-2xs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Done</span>
              </button>
            )}
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/85 p-4 rounded-2xl border border-emerald-200/70 shadow-2xs space-y-2 opacity-95 group relative hover:border-emerald-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase shadow-2xs">
                    Completed
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                      className="opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <h4 className="font-semibold text-slate-700 text-sm line-through">
                  {task.title}
                </h4>

                <div className="pt-1 text-[11px] font-medium text-slate-400">
                  Finished by {task.assigneeName || 'Member'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-card rounded-3xl border border-white/60 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100/90 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Add Workspace Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement user authentication routes"
                  className="neu-input w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Details, acceptance criteria, or links..."
                  className="neu-input w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="neu-input w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="neu-input w-full text-xs p-3 rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
                  >
                    {project.members.map((m) => (
                      <option key={m.id} value={m.user.name}>
                        {m.user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100/90">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="btn-gradleaf-secondary px-4 py-2.5 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="btn-gradleaf-primary px-5 py-2.5 text-xs font-bold rounded-xl shadow-tactile cursor-pointer"
                >
                  {creatingTask ? 'Adding...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
