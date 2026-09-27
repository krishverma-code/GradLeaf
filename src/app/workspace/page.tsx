'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import { Briefcase, ArrowRight, Plus, Loader2 } from 'lucide-react';

import { FALLBACK_PROJECTS } from '@/lib/fallbackData';

export default function WorkspaceIndexPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasNoProjects, setHasNoProjects] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const findUserWorkspace = async () => {
      try {
        const res = await fetch('/api/projects');
        let projects: any[] = [];
        if (res.ok) {
          projects = await res.json();
        }
        if (!Array.isArray(projects) || projects.length === 0) {
          projects = FALLBACK_PROJECTS;
        }
        // Find first project owned by currentUser or where currentUser is a member, or fallback to first project
        const userProject =
          projects.find(
            (p: any) =>
              p.ownerId === currentUser.id ||
              p.members?.some((m: any) => m.userId === currentUser.id)
          ) || projects[0];

        if (userProject) {
          router.replace(`/workspace/${userProject.id}`);
          return;
        }
        setHasNoProjects(true);
      } catch (e) {
        console.error('Failed to resolve workspace', e);
        const fallbackProject =
          FALLBACK_PROJECTS.find(
            (p: any) =>
              p.ownerId === currentUser.id ||
              p.members?.some((m: any) => m.userId === currentUser.id)
          ) || FALLBACK_PROJECTS[0];
        router.replace(`/workspace/${fallbackProject.id}`);
      } finally {
        setLoading(false);
      }
    };

    findUserWorkspace();
  }, [currentUser, router]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">
          Loading {currentUser?.name ? `${currentUser.name}'s workspace...` : 'workspace...'}
        </p>
      </div>
    );
  }

  if (hasNoProjects) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs space-y-5">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center mx-auto text-emerald-800">
          <Briefcase className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            No Active Workspace for {currentUser?.name}
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            You don&apos;t have any active projects or team collaborations yet. Create your own project or join one through the Marketplace.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/projects"
            className="btn-gradleaf-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-tactile active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Project in Marketplace
          </Link>
          <Link
            href="/matching"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
          >
            Smart Teammate Matcher
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
