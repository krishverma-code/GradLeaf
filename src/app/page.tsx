'use client';

import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import { useEffect, useState, useRef } from 'react';
import {
  Orbit,
  FolderGit2,
  Compass,
  ArrowRight,
  GraduationCap,
  Zap,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import GradLeafLogo from '@/components/GradLeafLogo';

/* ─── High-Impact Collegiate Campus Parallax Background ─── */
function CollegiateParallaxBackground({ scrollY }: { scrollY: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* 1. The Core Collegiate Campus Heritage Image with Parallax & Subtle Zoom */}
      <div
        className="absolute inset-0 will-change-transform bg-cover bg-center transition-transform duration-75 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2400&q=80')`,
          transform: `translateY(${scrollY * 0.18}px) scale(${1 + Math.min(scrollY * 0.0003, 0.08)})`,
          opacity: 0.38,
          filter: 'saturate(1.15) contrast(1.08)',
        }}
      />

      {/* 2. Frosted Ambient Lighting Vignette & Forest Tone Infusion */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 25%, rgba(247,250,248,0.65) 0%, rgba(247,250,248,0.88) 55%, #f7faf8 100%)',
        }}
      />

      {/* 3. Collegiate Green Light Rays & Subtle Aura */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(138,171,152,0.30) 0%, rgba(39,77,54,0.12) 45%, transparent 75%)',
          filter: 'blur(70px)',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* 4. Secondary Floating Sage Orbs for Multi-Layer Depth */}
      <div
        className="absolute rounded-full will-change-transform"
        style={{
          width: 440,
          height: 440,
          top: '25vh',
          left: '-5vw',
          background: 'radial-gradient(circle at 45% 45%, rgba(138,171,152,0.25) 0%, transparent 70%)',
          filter: 'blur(55px)',
          transform: `translateY(${scrollY * 0.28}px) translateX(${scrollY * 0.04}px)`,
        }}
      />
      <div
        className="absolute rounded-full will-change-transform"
        style={{
          width: 400,
          height: 400,
          top: '55vh',
          right: '-5vw',
          background: 'radial-gradient(circle at 55% 55%, rgba(39,77,54,0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
          transform: `translateY(${-scrollY * 0.12}px) translateX(${-scrollY * 0.05}px)`,
        }}
      />

      {/* 5. Collegiate Technical Blueprint Dot-Grid */}
      <div
        className="absolute inset-0 will-change-transform opacity-35"
        style={{
          backgroundImage: 'radial-gradient(rgba(39,77,54,0.20) 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
          transform: `translateY(${scrollY * 0.06}px)`,
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  const { allUsers } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showcaseRef.current) return;
    const rect = showcaseRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <>
      {/* ─── Parallax Collegiate Background ─── */}
      <CollegiateParallaxBackground scrollY={scrollY} />

      <div className="relative space-y-20 py-6 sm:py-10" style={{ zIndex: 1 }}>
        {/* ─── 1. HERO SECTION ─── */}
        <section className="relative text-center max-w-4xl mx-auto space-y-7 pt-2">
          {/* Top Collegiate Badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-3xl bg-[#8aab98] opacity-25 blur-xl group-hover:opacity-45 transition-opacity duration-300"></div>
              <GradLeafLogo size={88} className="relative rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#c2d8cc] text-[#142d1f] text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8aab98] shadow-[0_0_8px_rgba(138,171,152,0.8)] animate-pulse"></span>
              <span>GradLeaf • Education today, growth tomorrow</span>
              <span className="text-[10px] text-[#274d36] font-bold bg-[#edf4ec] px-2 py-0.5 rounded-full">v2.4</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Where Student Identity Meets <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#142d1f] via-[#234932] to-[#457257] bg-clip-text text-transparent">
              Smart Project Collaboration
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            The collegiate network designed to showcase verified student competencies, discover real campus initiatives, match with ideal peers through explainable AI, and ship portfolio projects in shared workspaces.
          </p>

          {/* Action Buttons (in the loved muted sage aesthetic) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/feed"
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl btn-gradleaf-primary font-bold text-sm tracking-tight cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <Compass className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              <span>Enter Campus Feed</span>
            </Link>
            <Link
              href="/matching"
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl btn-gradleaf-secondary font-bold text-sm tracking-tight cursor-pointer shadow-2xs hover:shadow-xs transition-all"
            >
              <Orbit className="w-4 h-4 text-[#8aab98] transition-transform duration-500 group-hover:rotate-180" />
              <span>Try Smart Teammate Matching</span>
            </Link>
          </div>

          {/* Live Active Trust Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-600 font-semibold">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#c2d8cc] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8aab98]" />
              Verified Student Profiles
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#c2d8cc] shadow-2xs">
              <Orbit className="w-3.5 h-3.5 text-[#8aab98]" />
              Explainable AI Matching
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#c2d8cc] shadow-2xs">
              <FolderGit2 className="w-3.5 h-3.5 text-[#8aab98]" />
              Sprint Kanban Workspaces
            </span>
          </div>
        </section>

        {/* ─── 2. INTERACTIVE PARALLAX SHOWCASE STAGE (Inspired by User Reference) ─── */}
        <section
          ref={showcaseRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 border border-[#c2d8cc]/80 bg-white/60 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(20,45,31,0.08),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300"
        >
          {/* Framed Visual Container with Perspective Depth */}
          <div className="relative overflow-hidden rounded-2xl h-[380px] sm:h-[460px] border border-white/60 shadow-inner group">
            {/* The Main Student Collaboration Focal Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out will-change-transform"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')`,
                transform: `scale(1.06) translate(${mousePos.x * -16}px, ${mousePos.y * -16 + scrollY * 0.05}px)`,
                filter: 'brightness(0.92) contrast(1.05)',
              }}
            />

            {/* Gradient Scrim for Legibility & Cinematic Mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent pointer-events-none" />

            {/* Framing Accent Lines (Parallax Perspective Overlay) */}
            <div className="absolute inset-4 sm:inset-6 border border-white/30 rounded-xl pointer-events-none transition-transform duration-200"
              style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
            />

            {/* Floating Parallax Card 1 (Top-Left): 98% AI Match Found */}
            <div
              className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/80 shadow-lg flex items-center gap-3 transition-transform duration-200 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * 24}px, ${mousePos.y * 24 - scrollY * 0.08}px)`,
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#edf4ec] border border-[#c2d8cc] flex items-center justify-center text-[#274d36] shadow-2xs">
                <Orbit className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                  <span>98% AI Match</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">PyTorch • Next.js • React</div>
              </div>
            </div>

            {/* Floating Parallax Card 2 (Top-Right): Verified Campus Network */}
            <div
              className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/80 shadow-lg hidden sm:flex items-center gap-3 transition-transform duration-200 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20 - scrollY * 0.06}px)`,
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#8aab98]/15 border border-[#8aab98]/40 flex items-center justify-center text-[#274d36]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-900">Verified Academics</div>
                <div className="text-[10px] text-slate-500 font-medium">18+ Partner Universities</div>
              </div>
            </div>

            {/* Floating Parallax Card 3 (Bottom-Left): Active Sprint Kanban */}
            <div
              className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/80 shadow-xl max-w-[260px] sm:max-w-xs transition-transform duration-200 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20 + scrollY * 0.05}px)`,
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#274d36]" />
                  Sprint Kanban Active
                </span>
                <span className="text-[9px] font-bold bg-[#edf4ec] text-[#274d36] px-2 py-0.5 rounded-full">
                  Sprint #4
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Ship Auth & Match Engine</span>
                  <span className="font-bold text-slate-800">12 / 14 Tasks</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#8aab98] h-1.5 rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>

            {/* Floating Parallax Card 4 (Bottom-Right): Teammate Avatars Ready */}
            <div
              className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/80 shadow-xl transition-transform duration-200 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18 + scrollY * 0.07}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="Priya" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Rahul" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-2xs" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop" alt="Ananya" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Squad Ready</div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All Roles Filled
                  </div>
                </div>
              </div>
            </div>

            {/* Central Stage Caption (Overlayed like the reference image) */}
            <div className="absolute inset-x-0 bottom-24 sm:bottom-28 text-center pointer-events-none px-4">
              <div className="inline-block bg-slate-950/60 backdrop-blur-md border border-white/20 px-5 py-2 rounded-2xl text-white">
                <div className="text-xs uppercase tracking-widest font-bold text-[#8aab98]">
                  Collegiate Innovation Commons
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-100">
                  Connect. Team Up. Ship Real Projects.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. LIVE CAMPUS PLATFORM STATS BAR ─── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#c2d8cc]/80 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">2,400+</div>
            <div className="text-xs text-slate-500 font-semibold">Active Student Creators</div>
          </div>
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#c2d8cc]/80 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">98.4%</div>
            <div className="text-xs text-slate-500 font-semibold">AI Match Accuracy</div>
          </div>
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#c2d8cc]/80 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">18+</div>
            <div className="text-xs text-slate-500 font-semibold">University Hubs</div>
          </div>
          <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#c2d8cc]/80 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">450+</div>
            <div className="text-xs text-slate-500 font-semibold">Projects Shipped</div>
          </div>
        </section>

        {/* ─── 4. RE-ARRANGED BENTO FEATURE GRID ─── */}
        <section className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-[#274d36] bg-[#edf4ec] inline-block px-3 py-1 rounded-full border border-[#c2d8cc]">
              Engineered For Academic Growth
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Three Pillars of Collegiate Success
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              GradLeaf eliminates friction between discovering opportunities and executing real collaborative projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Verified Student Identity */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 group hover:border-[#8aab98]/60">
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#edf4ec] border border-[#c2d8cc] text-[#274d36] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#8aab98] group-hover:text-white transition-all duration-300">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Student Identity & Skills
                    </h3>
                    <div className="text-[10px] text-slate-500 font-semibold">Verified Portfolio System</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Showcase coursework, verified credentials, and competencies structured by active mastery stage:
                </p>

                {/* Skill Pills preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-[#edf4ec] text-[#274d36] px-2.5 py-1 rounded-lg border border-[#c2d8cc]/80">
                    Learning • PyTorch
                  </span>
                  <span className="text-[10px] font-semibold bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-2xs">
                    Practicing • Docker
                  </span>
                  <span className="text-[10px] font-semibold bg-[#8aab98]/20 text-[#142d1f] px-2.5 py-1 rounded-lg border border-[#8aab98]/40">
                    Comfortable • Next.js
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/explore"
                  className="text-xs font-bold text-[#274d36] inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Explore Student Directory <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 2: Explainable AI Matching Engine */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 group hover:border-[#8aab98]/60">
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#edf4ec] border border-[#c2d8cc] text-[#274d36] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#8aab98] group-hover:text-white transition-all duration-300">
                    <Orbit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Explainable AI Matching
                    </h3>
                    <div className="text-[10px] text-slate-500 font-semibold">5-Factor Mathematical Rubric</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Transparent matching evaluating skills (40%), domain (20%), availability (20%), and team balance (20%).
                </p>

                {/* Rubric Breakdown Progress Preview */}
                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                      <span>Complementary Skills</span>
                      <span className="font-bold text-[#274d36]">40%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8aab98] h-1.5 rounded-full w-[40%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
                      <span>Shared Domain Interests</span>
                      <span className="font-bold text-[#274d36]">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8aab98] h-1.5 rounded-full w-[20%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/matching"
                  className="text-xs font-bold text-[#274d36] inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Test Matchmaker Engine <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 3: Kanban Sprint Workspaces */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 group hover:border-[#8aab98]/60">
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#edf4ec] border border-[#c2d8cc] text-[#274d36] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#8aab98] group-hover:text-white transition-all duration-300">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Sprint Workspaces
                    </h3>
                    <div className="text-[10px] text-slate-500 font-semibold">Private Team Kanban Boards</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Full project execution spaces with member management, Kanban task dragging, sprint metrics, and direct execution.
                </p>

                {/* Mini Task Board Cards */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[9px] uppercase font-bold text-slate-400">To Do</div>
                    <div className="text-[10px] font-semibold text-slate-700 mt-1">Design DB Schema</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#edf4ec] border border-[#c2d8cc]">
                    <div className="text-[9px] uppercase font-bold text-[#274d36]">In Progress</div>
                    <div className="text-[10px] font-semibold text-[#142d1f] mt-1">Train Embeddings</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/projects"
                  className="text-xs font-bold text-[#274d36] inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Browse Active Projects <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. "HOW IT WORKS" 3-STEP JOURNEY ─── */}
        <section className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-10 border border-[#c2d8cc]/80 bg-white/75 backdrop-blur-xl shadow-xs space-y-8">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#274d36]">Simple 3-Step Flow</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Campus Idea to Standout Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-[#274d36] text-white flex items-center justify-center font-bold text-sm shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Build Verified Campus Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                List your university, degree, coursework, and categorized skills with proven project references.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-[#8aab98] text-white flex items-center justify-center font-bold text-sm shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Discover Compatible Peers</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Use explainable AI matching to connect with engineers, designers, and researchers whose skills complement yours.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-[#142d1f] text-white flex items-center justify-center font-bold text-sm shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Launch Sprints & Ship</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Enter your private team Kanban workspace, manage sprint milestones, and ship code you can show recruiters.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 6. PRODUCTION CTA BANNER (FROSTED AURORA BENTO) ─── */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#c2d8cc] bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(20,45,31,0.08),inset_0_1px_0_rgba(255,255,255,1)]">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(39,77,54,0.06)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
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
                <Link href="/feed" className="btn-gradleaf-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs shadow-tactile active:scale-95 group transition-all">
                  Explore Student Feed{' '}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-[#f4f8f5] text-slate-800 font-bold text-xs border border-[#c2d8cc] shadow-2xs hover:border-[#8aab98] active:scale-95 transition-all">
                  Browse Projects Marketplace
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 hidden sm:block">
              <div className="bg-white/90 backdrop-blur-xl border border-[#c2d8cc] rounded-3xl p-5 shadow-[0_12px_30px_rgba(20,45,31,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] space-y-4 hover:shadow-[0_16px_36px_rgba(20,45,31,0.09)] transition-all">
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
    </>
  );
}
