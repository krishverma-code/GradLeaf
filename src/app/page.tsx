'use client';

import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import { useEffect, useRef } from 'react';
import {
  Orbit,
  Users,
  FolderGit2,
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

  // Parallax refs
  const heroRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const ctaOrbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Hero orbs move at different speeds (parallax depth layers)
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translateY(${scrollY * 0.18}px) translateX(${scrollY * 0.04}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translateY(${scrollY * 0.28}px) translateX(${-scrollY * 0.06}px)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
      // Hero content drifts up slightly (subtle)
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translateY(${scrollY * 0.07}px)`;
      }
      // CTA section orb
      if (ctaOrbRef.current) {
        ctaOrbRef.current.style.transform = `translateY(${-scrollY * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* ─── Hero Section with Parallax ─── */}
      <section ref={heroRef} className="relative text-center max-w-4xl mx-auto space-y-7 overflow-visible">

        {/* Parallax Layer 1 — large ambient orb top-right (slowest) */}
        <div
          ref={orb1Ref}
          className="absolute -top-20 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none will-change-transform"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(138,171,152,0.18) 0%, rgba(138,171,152,0.06) 50%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Parallax Layer 2 — medium orb bottom-left (faster) */}
        <div
          ref={orb2Ref}
          className="absolute -bottom-10 -left-24 w-[300px] h-[300px] rounded-full pointer-events-none will-change-transform"
          style={{
            background: 'radial-gradient(circle at 60% 50%, rgba(109,164,133,0.14) 0%, rgba(109,164,133,0.05) 55%, transparent 80%)',
            filter: 'blur(32px)',
          }}
        />

        {/* Parallax Layer 3 — subtle dot pattern (slowest of all) */}
        <div
          ref={orb3Ref}
          className="absolute inset-0 pointer-events-none will-change-transform"
          style={{
            backgroundImage: 'radial-gradient(rgba(39,77,54,0.09) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Hero Content — drifts slightly slower than orbs */}
        <div ref={heroContentRef} className="relative z-10 will-change-transform space-y-7">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-[#8aab98] opacity-15 blur-lg group-hover:opacity-25 transition-opacity"></div>
              <GradLeafLogo size={84} className="relative rounded-3xl shadow-xl hover:scale-105 transition-transform" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#edf4ec] border border-[#274d36]/25 text-[#142d1f] text-xs font-bold shadow-[0_1px_2px_rgba(20,45,31,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <span className="w-2 h-2 rounded-full bg-[#8aab98] shadow-[0_0_6px_rgba(138,171,152,0.6)] animate-pulse"></span>
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
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl btn-gradleaf-primary font-bold text-sm tracking-tight cursor-pointer"
            >
              <Compass className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              <span>Enter Campus Feed</span>
            </Link>
            <Link
              href="/matching"
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl btn-gradleaf-secondary font-bold text-sm tracking-tight cursor-pointer"
            >
              <Orbit className="w-4 h-4 text-[#8aab98] transition-transform duration-500 group-hover:rotate-180" />
              <span>Try Smart Teammate Matching</span>
            </Link>
          </div>

          {/* Live Active Community Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-slate-600 font-semibold">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8aab98]" />
              Verified Student Profiles
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 shadow-2xs">
              <Orbit className="w-3.5 h-3.5 text-[#8aab98]" />
              Explainable AI Matching
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 shadow-2xs">
              <FolderGit2 className="w-3.5 h-3.5 text-[#8aab98]" />
              Sprint Kanban Workspaces
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 group">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#edf4ec] border border-[#274d36]/20 text-[#274d36] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#8aab98] group-hover:text-white transition-all duration-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Student Identity & Skills
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Showcase coursework, self-reported skills categorized by learning status (Learning, Practicing, Project Experience, Comfortable), and verified academic background.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/explore"
              className="text-[11px] font-bold text-[#1e3c2b] uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
            >
              Profile & Portfolio Engine <span>→</span>
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 group">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#edf4ec] border border-[#274d36]/20 text-[#274d36] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#8aab98] group-hover:text-white transition-all duration-200">
                <Orbit className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Explainable AI Matching
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Transparent 5-factor mathematical rubric evaluating skills (40%), domain interest (20%), availability (20%), experience (10%), and team balance (10%) without black-box guesswork.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/matching"
              className="text-[11px] font-bold text-[#1e3c2b] uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
            >
              Transparent Algorithm <span>→</span>
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 group">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#edf4ec] border border-[#274d36]/20 text-[#274d36] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#8aab98] group-hover:text-white transition-all duration-200">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Interactive Workspaces
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Full private project execution spaces with member management, Kanban task tracking, single task and batch deletion, and direct sprint coordination.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/projects"
              className="text-[11px] font-bold text-[#1e3c2b] uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
            >
              Team Kanban Workspace <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner with Parallax Orb ─── */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#c2d8cc] bg-gradient-to-br from-white via-[#f4f8f5] to-slate-50/90 shadow-[0_20px_50px_-20px_rgba(20,45,31,0.06),inset_0_1px_0_rgba(255,255,255,1)]">
        {/* Parallax background orb */}
        <div
          ref={ctaOrbRef}
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none will-change-transform"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(138,171,152,0.22) 0%, rgba(138,171,152,0.07) 55%, transparent 80%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 60% 60%, rgba(109,164,133,0.15) 0%, transparent 70%)',
            filter: 'blur(36px)',
          }}
        />

        {/* Micro-dot tech grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(39,77,54,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf4ec] border border-[#c2d8cc] text-[#142d1f] text-xs font-bold tracking-wide shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8aab98] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#274d36]"></span>
              </span>
              <Orbit className="w-3.5 h-3.5 text-[#274d36]" />
              GradLeaf Collegiate Hub
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.18]">
              Ready to build your next{' '}
              <span className="bg-gradient-to-r from-[#274d36] via-[#3d6652] to-[#8aab98] bg-clip-text text-transparent">
                standout portfolio project?
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-xl">
              Connect your coursework, showcase verified competencies, and team up with peer engineers across top universities today.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/feed"
                className="btn-gradleaf-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs shadow-tactile active:scale-95 group transition-all"
              >
                Explore Student Feed{' '}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-[#f4f8f5] text-slate-800 font-bold text-xs border border-[#c2d8cc] shadow-2xs hover:border-[#8aab98] active:scale-95 transition-all"
              >
                Browse Projects Marketplace
              </Link>
            </div>
          </div>

          {/* Right Column: Squad Preview Card */}
          <div className="lg:col-span-5 hidden sm:block">
            <div className="bg-white/85 backdrop-blur-xl border border-[#c2d8cc] rounded-3xl p-5 shadow-[0_12px_30px_rgba(20,45,31,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-4 hover:shadow-[0_16px_36px_rgba(20,45,31,0.09)] transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#edf4ec] border border-[#c2d8cc] flex items-center justify-center shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-[#3d6652]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sprint Collaboration</div>
                    <div className="text-[10px] text-slate-500">Autonomous Teammate Match</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#274d36] bg-[#edf4ec] px-2.5 py-0.5 rounded-full border border-[#c2d8cc]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8aab98] animate-pulse"></span>
                  98% Match
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                  <span>Squad Formation</span>
                  <span className="font-bold text-slate-800">3 of 4 Filled</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#8aab98] to-[#274d36] h-1.5 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="Priya" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Rahul" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop" alt="Ananya" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#274d36] bg-[#edf4ec] border border-[#c2d8cc] px-2 py-0.5 rounded-md">
                    Open: Fullstack Lead
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {['Next.js 15', 'TypeScript', 'PyTorch', 'Prisma'].map((tech) => (
                  <span key={tech} className="text-[10px] font-medium text-slate-700 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
