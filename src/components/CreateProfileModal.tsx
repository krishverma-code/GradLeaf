'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import {
  X,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Clock,
  Briefcase,
  Camera,
  Layers,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
];

const COLLEGE_SUGGESTIONS = [
  'IIT Delhi',
  'BITS Pilani',
  'Stanford University',
  'MIT',
  'UC Berkeley',
  'Carnegie Mellon University',
  'NUS Singapore',
  'Georgia Tech',
];

const SKILL_SUGGESTIONS = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Python', category: 'AI / ML' },
  { name: 'PyTorch', category: 'AI / ML' },
  { name: 'LangChain', category: 'AI / ML' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Flutter', category: 'Frontend' },
];

export default function CreateProfileModal() {
  const router = useRouter();
  const { showCreateProfileModal, setShowCreateProfileModal, createProfile } = useUser();

  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [year, setYear] = useState<number>(3);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('15 hrs/week (Flexible)');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [selectedSkills, setSelectedSkills] = useState<{ name: string; category: string }[]>([
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showCreateProfileModal) return null;

  const handleToggleSkill = (skill: { name: string; category: string }) => {
    if (selectedSkills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
      setSelectedSkills(selectedSkills.filter((s) => s.name.toLowerCase() !== skill.name.toLowerCase()));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const name = customSkillInput.trim();
    if (!selectedSkills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setSelectedSkills([...selectedSkills, { name, category: 'Frontend' }]);
    }
    setCustomSkillInput('');
  };

  const handleAIBioSuggest = () => {
    const skillsList = selectedSkills.map((s) => s.name).join(', ') || 'modern fullstack engineering';
    const suggestedHeadline = `${course || 'CS'} Student at ${college || 'University'} • ${skillsList.slice(0, 45)}`;
    const suggestedBio = `Junior ${course || 'engineering'} student passionate about solving campus challenges. Experienced in ${skillsList}. Open for hackathons, capstones, and innovative builder collaborations!`;
    if (!headline) setHeadline(suggestedHeadline);
    setBio(suggestedBio);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Student name is required');
      return;
    }
    if (!college.trim()) {
      setError('University / College is required');
      return;
    }
    if (!course.trim()) {
      setError('Degree or course is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newProfile = await createProfile({
        name: name.trim(),
        college: college.trim(),
        course: course.trim(),
        year,
        headline: headline.trim() || `${course} Student at ${college}`,
        bio: bio.trim() || `Student builder interested in campus collaborations.`,
        availability,
        avatarUrl,
        skills: selectedSkills.map((s) => ({
          name: s.name,
          category: s.category,
          status: 'Comfortable',
          proficiency: 4,
        })),
        githubUrl: githubUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
      });

      setShowCreateProfileModal(false);
      // Navigate to the newly created profile
      router.push(`/profile/${newProfile.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create student profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-teal-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#274d36] text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Create Student Profile
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Add a new campus builder with verified skills & availability
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateProfileModal(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Avatar Preset Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" /> Choose Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatarUrl(preset)}
                  className={`relative rounded-2xl overflow-hidden ring-2 transition-all p-0.5 ${
                    avatarUrl === preset ? 'ring-[#274d36] scale-105 shadow-md' : 'ring-transparent hover:ring-slate-300'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx + 1}`} className="w-12 h-12 rounded-xl object-cover" />
                  {avatarUrl === preset && (
                    <span className="absolute bottom-1 right-1 bg-[#274d36] text-white rounded-full p-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Patel"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Campus / University *</label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
              />
            </div>
          </div>

          {/* University Preset Quick Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Select:</span>
            {COLLEGE_SUGGESTIONS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCollege(c)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                  college === c
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Degree & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Degree & Course *</label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
              >
                <option value={1}>1st Year (Freshman)</option>
                <option value={2}>2nd Year (Sophomore)</option>
                <option value={3}>3rd Year (Junior)</option>
                <option value={4}>4th Year (Senior)</option>
              </select>
            </div>
          </div>

          {/* Availability & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" /> Weekly Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. 15 hrs/week (Flexible Evenings)"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Headline Tagline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full-Stack Lead • React, FastAPI, Docker"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
              />
            </div>
          </div>

          {/* Technical Skills Tag Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" /> Technical Skills & Tools ({selectedSkills.length} selected)
              </label>
            </div>

            {/* Selected Skills Tags */}
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]">
              {selectedSkills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={handleAddCustomSkill}
                  placeholder="+ Add skill..."
                  className="text-xs bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-400 py-1 px-1.5 w-24"
                />
                {customSkillInput && (
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="text-xs text-emerald-800 font-bold px-1.5 py-0.5 hover:bg-emerald-100 rounded"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>

            {/* Suggested Skill Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 self-center">Popular:</span>
              {SKILL_SUGGESTIONS.map((skill) => {
                const isSelected = selectedSkills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase());
                return (
                  <button
                    type="button"
                    key={skill.name}
                    onClick={() => handleToggleSkill(skill)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio with AI Suggest */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Bio & Project Vision</label>
              <button
                type="button"
                onClick={handleAIBioSuggest}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-700" /> AI Bio Drafter
              </button>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students about your background, interests, and what kinds of projects you want to build..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium transition-all"
            />
          </div>

          {/* Social Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Github className="w-3 h-3" /> GitHub URL
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Linkedin className="w-3 h-3" /> LinkedIn URL
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Portfolio URL
              </label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateProfileModal(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gradleaf-primary px-6 py-2.5 text-xs font-bold rounded-xl shadow-tactile flex items-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Profile...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Student Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
