'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Network,
  Users,
  Briefcase,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  userSkills: {
    status: string;
    proficiency: number;
    user: { id: string; name: string; avatarUrl: string | null; college: string; course: string };
  }[];
  projectSkills: {
    role: string | null;
    priority: string;
    project: { id: string; title: string; domain: string; status: string };
  }[];
}

function SkillGraphContent() {
  const searchParams = useSearchParams();
  const initialHighlight = searchParams.get('highlight') || 'React';
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const list: SkillNode[] = await res.json();
          setSkills(list);
          const found = list.find((s) => s.name.toLowerCase() === initialHighlight.toLowerCase()) || list[0];
          setSelectedSkill(found);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [initialHighlight]);

  const categories = ['All', 'Frontend', 'Backend', 'AI / ML', 'Database', 'Design', 'DevOps'];
  const filteredSkills = skills.filter((s) => filterCategory === 'All' || s.category === filterCategory);

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-glass-card">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold mb-2 shadow-2xs">
          <Network className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Campus Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Visual Skill Graph & Node Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium leading-relaxed">
          Click any skill node to discover connected student peers, active recruiting projects, and learning resources across collegiate disciplines.
        </p>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-slate-100/90">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1">Categories:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterCategory === c
                  ? 'btn-gradleaf-primary text-white shadow-tactile'
                  : 'bg-white/90 border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-800 shadow-2xs'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Visual Graph + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Node Network */}
        <div className="lg:col-span-7 glass-card rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-glass-card min-h-[520px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100/90">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 tracking-tight">
              <Layers className="w-4 h-4 text-emerald-600" />
              Skill Nodes
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Click node to inspect connections</span>
          </div>

          {/* Interactive Cloud of Nodes */}
          <div className="py-8 flex flex-wrap items-center justify-center gap-3.5">
            {filteredSkills.map((sk) => {
              const isSelected = selectedSkill?.id === sk.id;
              const studentCount = sk.userSkills?.length || 0;
              const projectCount = sk.projectSkills?.length || 0;

              return (
                <button
                  key={sk.id}
                  onClick={() => setSelectedSkill(sk)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'btn-gradleaf-primary text-white shadow-tactile ring-2 ring-emerald-300 scale-105'
                      : 'bg-white/90 text-slate-800 border-slate-200/90 hover:border-emerald-300 hover:shadow-tactile-subtle hover:scale-105 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="font-extrabold text-sm tracking-tight">{sk.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-emerald-800/80 text-emerald-100' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sk.category}
                    </span>
                  </div>

                  <div className={`text-[11px] flex items-center gap-2.5 pt-1 font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {studentCount} {studentCount === 1 ? 'peer' : 'peers'}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-50/80 rounded-2xl text-center text-xs text-slate-500 font-medium border border-slate-100">
            Node visual map links students possessing skills directly with live team vacancies.
          </div>
        </div>

        {/* Right Column: Node Details & Connected Relationships */}
        <div className="lg:col-span-5 space-y-6">
          {selectedSkill ? (
            <div className="glass-card rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-glass-card space-y-5">
              <div className="border-b border-slate-100/90 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {selectedSkill.category} Domain Node
                  </span>
                  <span className="badge-enamel-green text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Active Node
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">{selectedSkill.name}</h2>
              </div>

              {/* Connected Students */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Students with {selectedSkill.name} ({selectedSkill.userSkills?.length || 0})
                </h4>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {selectedSkill.userSkills?.map((us, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl border border-slate-100 bg-white/80 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={us.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop'}
                          alt={us.user.name}
                          className="w-7 h-7 rounded-xl object-cover ring-1 ring-emerald-500/20"
                        />
                        <div>
                          <Link href={`/profile/${us.user.id}`} className="font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                            {us.user.name}
                          </Link>
                          <div className="text-[10px] text-slate-500 font-medium">{us.user.college}</div>
                        </div>
                      </div>
                      <span className="badge-enamel-green text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {us.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Projects */}
              <div className="space-y-3 pt-3.5 border-t border-slate-100/90">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Projects Requiring {selectedSkill.name} ({selectedSkill.projectSkills?.length || 0})
                </h4>

                <div className="space-y-2.5">
                  {selectedSkill.projectSkills && selectedSkill.projectSkills.length > 0 ? (
                    selectedSkill.projectSkills.map((ps, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl border border-slate-200/80 bg-white/80 flex items-center justify-between text-xs shadow-2xs hover:border-emerald-300 transition-colors"
                      >
                        <div>
                          <h5 className="font-extrabold text-slate-900 tracking-tight">{ps.project.title}</h5>
                          <span className="text-[10px] text-emerald-800 font-bold">
                            Role: {ps.role || 'Contributor'}
                          </span>
                        </div>
                        <Link
                          href={`/projects?id=${ps.project.id}`}
                          className="btn-gradleaf-secondary px-3 py-1.5 rounded-xl font-bold text-[11px]"
                        >
                          View Project
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-medium">No active projects requiring this skill yet.</p>
                  )}
                </div>
              </div>

              {/* Learning Resources */}
              <div className="pt-3.5 border-t border-slate-100/90">
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs space-y-1.5 shadow-inner">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Recommended Campus Resources:
                  </div>
                  <p className="text-emerald-900/80 text-[11px] leading-relaxed font-medium">
                    Access curated official documentation and university workshop notes for {selectedSkill.name}.
                  </p>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(selectedSkill.name + ' student tutorial documentation')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline text-[11px] pt-1"
                  >
                    Open Student Guides <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-14 text-center text-slate-400 glass-card rounded-3xl border border-slate-200/80 shadow-glass-card font-medium text-xs">
              Select a skill node to view connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SkillGraphPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse">Loading Skill Graph...</div>}>
      <SkillGraphContent />
    </Suspense>
  );
}
