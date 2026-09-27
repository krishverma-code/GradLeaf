'use client';

import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import {
  Sparkles,
  Users,
  Briefcase,
  Compass,
  ArrowRight,
  GraduationCap,
  Network,
  CheckCircle,
  Trophy,
  Zap,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import GradLeafLogo from '@/components/GradLeafLogo';

export default function LandingPage() {
  const { allUsers, switchUser } = useUser();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-7">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-[#274d36] opacity-15 blur-lg group-hover:opacity-25 transition-opacity"></div>
            <GradLeafLogo size={84} className="relative rounded-3xl shadow-xl hover:scale-105 transition-transform" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf4ec] border border-[#274d36]/25 text-[#142d1f] text-xs font-bold shadow-[0_1px_2px_rgba(20,45,31,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <span className="w-2 h-2 rounded-full bg-[#274d36] shadow-[0_0_6px_rgba(39,77,54,0.4)] animate-pulse"></span>
            <span>GradLeaf • Education today, growth tomorrow</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
          Where Student Identity Meets <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#142d1f] via-[#21442f] to-[#2f5a3f] bg-clip-text text-transparent">
            Smart Project Collaboration
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          The collegiate network designed to showcase verified student competencies, discover real campus initiatives, match with ideal peers through explainable AI, and ship portfolio projects in shared workspaces.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/feed"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-gradleaf-primary font-bold text-sm"
          >
            <Compass className="w-4 h-4" />
            Enter Campus Feed
          </Link>
          <Link
            href="/matching"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-gradleaf-secondary font-bold text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#274d36]" />
            Try Smart Teammate Matching
          </Link>
        </div>

        {/* Live Active Community Strip */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-slate-600 font-semibold">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#274d36]" />
            Verified Student Profiles
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#274d36]" />
            Explainable AI Matching
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-[#274d36]" />
            Sprint Kanban Workspaces
          </span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-7 rounded-3xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-[#edf4ec] to-[#e1ece1] border border-[#274d36]/20 text-[#1e3c2b] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Student Identity & Skills</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Showcase coursework, self-reported skills categorized by learning status (Learning, Practicing, Project Experience, Comfortable), and verified academic background.
            </p>
          </div>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#1e3c2b] uppercase tracking-wider">
              Profile & Portfolio Engine →
            </span>
          </div>
        </div>

        <div className="glass-card p-7 rounded-3xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-[#edf4ec] to-[#e1ece1] border border-[#274d36]/20 text-[#1e3c2b] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Explainable AI Matching</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Transparent 5-factor mathematical rubric evaluating skills (40%), domain interest (20%), availability (20%), experience (10%), and team balance (10%) without black-box guesswork.
            </p>
          </div>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#1e3c2b] uppercase tracking-wider">
              Transparent Algorithm →
            </span>
          </div>
        </div>

        <div className="glass-card p-7 rounded-3xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 border border-slate-300/70 text-slate-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Interactive Workspaces</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Full private project execution spaces with member management, Kanban task tracking, single task and batch deletion, and direct sprint coordination.
            </p>
          </div>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#1e3c2b] uppercase tracking-wider">
              Team Kanban Workspace →
            </span>
          </div>
        </div>
      </section>

      {/* Production Call To Action Banner */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-11 shadow-2xl bg-gradient-to-br from-[#0e1f15] via-[#142d1f] to-[#09150e] text-white border border-[#274d36]/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#274d36]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#274d36]/40 border border-[#43825d]/40 text-[#cde0d2] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#86c09b]" />
            GradLeaf Collegiate Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to build your next standout portfolio project?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Connect your coursework, showcase verified competencies, and connect with peer engineers across top universities today.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradleaf-primary font-bold text-xs"
            >
              Explore Student Feed <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all shadow-xs"
            >
              Browse Projects Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
