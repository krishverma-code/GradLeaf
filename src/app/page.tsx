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
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import GradLeafLogo from '@/components/GradLeafLogo';

/* ─── 4 Curated Collegiate Portals for the Morphing Portal Gateway ─── */
const PORTALS = [
  {
    id: 1,
    tag: 'PORTAL 01 • PROVEN TALENT',
    title: 'Showcase Verified Identity',
    subtitle: 'From Coursework to Real Competency',
    desc: 'Ditch unverified resumes. Showcase verified university coursework, GitHub repositories, and competencies structured by active mastery stage.',
    cta: 'Explore Student Directory',
    href: '/explore',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1800&q=80', // Collegiate Campus Quad
    badge: '18+ Partner Universities',
    metric: '94% Verified Profiles',
  },
  {
    id: 2,
    tag: 'PORTAL 02 • EXPLAINABLE AI',
    title: 'Discover Ideal Teammates',
    subtitle: 'Transparent 5-Factor Algorithmic Matching',
    desc: 'No black-box guesswork. Match across complementary skills (40%), domain interest (20%), availability (20%), experience (10%), and team balance (10%).',
    cta: 'Launch AI Matchmaker',
    href: '/matching',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1800&q=80', // High-Tech AI Neural Lab
    badge: 'Autonomous Teammate Match',
    metric: '98.4% Match Accuracy',
  },
  {
    id: 3,
    tag: 'PORTAL 03 • TEAM EXECUTION',
    title: 'Ship in Sprint Workspaces',
    subtitle: 'Private Collaborative Kanban Command Centers',
    desc: 'Organize team members, assign sprint tasks, track real-time progress across Kanban columns, and coordinate milestones with zero friction.',
    cta: 'Open Project Workspaces',
    href: '/projects',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80', // Student Tech Team Working Together
    badge: 'Sprint Kanban Active',
    metric: '12 / 14 Tasks Shipped',
  },
  {
    id: 4,
    tag: 'PORTAL 04 • STANDOUT PORTFOLIO',
    title: 'Launch Recruiter-Ready Work',
    subtitle: 'Turn Projects Into Career Breakthroughs',
    desc: 'Transform academic hackathons and campus initiatives into shipped public repositories, peer endorsements, and proof-of-work that gets you hired.',
    cta: 'Explore Campus Feed',
    href: '/feed',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1800&q=80', // Students Pitching & Shipping Projects
    badge: 'Verified Portfolio Engine',
    metric: '450+ Projects Shipped',
  },
];

/* ─── Ambient Collegiate Atmospheric Background ─── */
function CollegiateBackground({ scrollY }: { scrollY: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* 1. Subtle Campus Landscape Parallax Canvas */}
      <div
        className="absolute inset-0 will-change-transform bg-cover bg-center transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2400&q=80')`,
          transform: `translateY(${scrollY * 0.14}px) scale(${1 + Math.min(scrollY * 0.0002, 0.06)})`,
          opacity: 0.28,
          filter: 'saturate(1.1) contrast(1.05)',
        }}
      />

      {/* 2. Frosted Gradient Overlay for Pristine Typography Contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 95% 75% at 50% 20%, rgba(247,250,248,0.72) 0%, rgba(247,250,248,0.92) 55%, #f7faf8 100%)',
        }}
      />

      {/* 3. Ambient Sage/Forest Luminous Aura */}
      <div
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[520px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(138,171,152,0.35) 0%, rgba(39,77,54,0.12) 50%, transparent 75%)',
          filter: 'blur(75px)',
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      />

      {/* 4. Technical Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 will-change-transform opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(39,77,54,0.22) 1.5px, transparent 1.5px)',
          backgroundSize: '34px 34px',
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  const { allUsers } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [activePortal, setActivePortal] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-advance portals unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActivePortal((prev) => (prev + 1) % PORTALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = PORTALS[activePortal];

  return (
    <>
      {/* ─── Fixed Parallax Collegiate Backdrop ─── */}
      <CollegiateBackground scrollY={scrollY} />

      <div className="relative space-y-20 py-6 sm:py-10" style={{ zIndex: 1 }}>
        {/* ─── 1. HERO SECTION ─── */}
        <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-2">
          {/* Top Collegiate Pill Badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-3xl bg-[#8aab98] opacity-25 blur-xl group-hover:opacity-45 transition-opacity duration-300"></div>
              <GradLeafLogo size={88} className="relative rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#c2d8cc] text-[#142d1f] text-xs font-semibold shadow-xs">
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

          {/* Action Buttons */}
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

          {/* Live Trust Tags */}
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

        {/* ─── 2. THE MORPHING PORTAL GATEWAY (Inspired by Slider Revolution Reference) ─── */}
        <section
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 border border-[#c2d8cc] bg-gradient-to-br from-white/90 via-[#f4f8f5]/80 to-slate-50/90 backdrop-blur-2xl shadow-[0_30px_70px_-20px_rgba(20,45,31,0.12),inset_0_1px_0_rgba(255,255,255,1)]"
        >
          {/* Top Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#c2d8cc]/60">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#274d36]">
                <Sparkles className="w-3.5 h-3.5 text-[#8aab98]" />
                Interactive Gateway • Teleport Through Campus Innovation
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                The Collegiate Portals
              </h2>
            </div>

            {/* Portal Tab Navigation Controls */}
            <div className="flex items-center gap-2">
              {PORTALS.map((portal, idx) => (
                <button
                  key={portal.id}
                  onClick={() => setActivePortal(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePortal === idx
                      ? 'bg-[#274d36] text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-slate-600 border border-[#c2d8cc]/80'
                  }`}
                >
                  0{portal.id}
                </button>
              ))}
              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              <button
                onClick={() => setActivePortal((prev) => (prev === 0 ? PORTALS.length - 1 : prev - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-[#c2d8cc] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
                title="Previous Portal"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePortal((prev) => (prev + 1) % PORTALS.length)}
                className="w-8 h-8 rounded-xl bg-white border border-[#c2d8cc] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
                title="Next Portal"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Portal Stage: Left Info • Center Morphing Archway • Right Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* Left Column: Index & Primary Teleport Title */}
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <div className="inline-block text-xs font-mono font-black text-[#274d36] bg-[#edf4ec] border border-[#c2d8cc] px-3 py-1 rounded-full">
                0{current.id} / 0{PORTALS.length}
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8aab98]">
                {current.tag}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {current.title}
              </h3>

              <div className="text-xs font-semibold text-[#274d36]">
                {current.subtitle}
              </div>

              <div className="pt-2 hidden lg:block">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/80 border border-[#c2d8cc] px-3 py-1.5 rounded-xl shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8aab98]" />
                  {current.badge}
                </span>
              </div>
            </div>

            {/* Center Column: The Iconic Morphing Stone Archway Portal */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative group cursor-pointer" onClick={() => setActivePortal((prev) => (prev + 1) % PORTALS.length)}>
                {/* Outer Glow Halo Ring */}
                <div className="absolute -inset-4 rounded-[120px] bg-gradient-to-b from-[#8aab98]/40 to-[#274d36]/20 blur-2xl group-hover:scale-105 transition-transform duration-500"></div>

                {/* The Morphing Archway Mask Container */}
                <div className="portal-arch relative w-[240px] sm:w-[270px] h-[340px] sm:h-[380px] overflow-hidden border-4 border-white/90 shadow-2xl bg-slate-900">
                  {/* Active Portal Image with Smooth Scale Zoom */}
                  <div
                    key={current.id}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform group-hover:scale-110"
                    style={{
                      backgroundImage: `url('${current.image}')`,
                    }}
                  />

                  {/* Portal Vignette Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Morphing Portal Arch Decorative Frame Lines */}
                  <div className="absolute inset-3 border border-white/40 rounded-[inherit] pointer-events-none" />

                  {/* Portal Bottom HUD Tag */}
                  <div className="absolute bottom-5 inset-x-3 text-center pointer-events-none">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      Click to Teleport ↗
                    </span>
                  </div>
                </div>

                {/* Floating Orbit Beacon */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-[#c2d8cc] shadow-md flex items-center gap-1.5 text-[10px] font-bold text-[#274d36]">
                  <Orbit className="w-3 h-3 text-[#8aab98] animate-spin-slow" />
                  <span>{current.metric}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Portal Description & Direct Action CTA */}
            <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {current.desc}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-3">
                <Link
                  href={current.href}
                  className="btn-gradleaf-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all w-full sm:w-auto"
                >
                  <span>{current.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-[11px] text-slate-500 font-medium">
                  Auto-teleporting every 6s • Hover to pause
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Portal Indicator Progress Bar */}
          <div className="pt-8 grid grid-cols-4 gap-2">
            {PORTALS.map((portal, idx) => (
              <button
                key={portal.id}
                onClick={() => setActivePortal(idx)}
                className="group text-left space-y-1.5 focus:outline-none cursor-pointer"
              >
                <div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activePortal === idx ? 'bg-[#274d36] w-full' : 'bg-transparent group-hover:bg-slate-300 w-full'
                    }`}
                  />
                </div>
                <div className="text-[10px] font-bold text-slate-600 truncate hidden sm:block">
                  0{portal.id}. {portal.title.split(' ')[0]}
                </div>
              </button>
            ))}
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
