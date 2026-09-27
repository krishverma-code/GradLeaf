'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/userContext';
import {
  Heart,
  MessageSquare,
  Share2,
  Send,
  Orbit,
  TrendingUp,
  Tag,
  Briefcase,
  Users,
  Compass,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import GradLeafLogo from '@/components/GradLeafLogo';

interface PostType {
  id: string;
  content: string;
  tag: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    college: string;
    course: string;
    avatarUrl: string | null;
  };
  likes: { id: string; userId: string }[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string; avatarUrl: string | null };
  }[];
}

export default function FeedPage() {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Teammate Search');
  const [posting, setPosting] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !currentUser) return;
    setPosting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          content: newContent,
          tag: selectedTag,
        }),
      });
      if (res.ok) {
        setNewContent('');
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!currentUser) return;
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const hasLiked = p.likes.some((l) => l.userId === currentUser.id);
            return {
              ...p,
              likes: hasLiked
                ? p.likes.filter((l) => l.userId !== currentUser.id)
                : [...p.likes, { id: 'temp-' + Date.now(), userId: currentUser.id }],
            };
          }
          return p;
        })
      );

      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
    } catch (e) {
      console.error(e);
      fetchPosts();
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim() || !currentUser) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          content: commentText,
        }),
      });
      if (res.ok) {
        setCommentText('');
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const tagColors: Record<string, string> = {
    'Teammate Search': 'badge-enamel-green text-[10px] font-bold px-2.5 py-0.5 rounded-full',
    'Project Milestone': 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
    'Hackathon Update': 'bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
    'Tech Resource': 'bg-teal-50 text-teal-800 border border-teal-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
    General: 'bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
      
      {/* Left Sidebar - Profile Card */}
      <aside className="lg:col-span-3 space-y-4">
        {currentUser && (
          <div className="glass-card rounded-3xl border border-slate-200/80 p-6 shadow-glass-card">
            <div className="flex flex-col items-center text-center">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-tactile-subtle mb-3"
              />
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{currentUser.name}</h3>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">{currentUser.course}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{currentUser.college}</p>
              
              <div className="w-full border-t border-slate-100 my-4"></div>

              <div className="w-full flex justify-between text-xs text-slate-600 px-1 mb-2">
                <span className="font-medium">College Year</span>
                <span className="font-extrabold text-slate-900">Year {currentUser.year}</span>
              </div>
              <div className="w-full flex justify-between text-xs text-slate-600 px-1">
                <span className="font-medium">Availability</span>
                <span className="badge-enamel-green text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
              </div>

              <Link
                href={`/profile/${currentUser.id}`}
                className="btn-gradleaf-secondary w-full mt-4 py-2.5 px-3 text-xs font-bold text-center rounded-xl"
              >
                View Full Student Profile
              </Link>
            </div>
          </div>
        )}

        {/* Quick Nav Tools */}
        <div className="glass-card rounded-3xl border border-slate-200/80 p-5 shadow-glass-card space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Quick Tools
          </div>
          <Link
            href="/matching"
            className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
          >
            <Orbit className="w-4 h-4 text-emerald-600" />
            AI Teammate Matcher
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
          >
            <Briefcase className="w-4 h-4 text-emerald-700" />
            Active Projects Hub
          </Link>
          <Link
            href="/graph"
            className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
          >
            <Users className="w-4 h-4 text-teal-600" />
            Skill Graph Explorer
          </Link>
        </div>
      </aside>

      {/* Center Feed */}
      <main className="lg:col-span-6 space-y-6">
        
        {/* Post Composer */}
        <div className="glass-card rounded-3xl border border-slate-200/80 p-6 shadow-glass-card space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20"
            />
            <div className="flex-1">
              <span className="text-xs font-extrabold text-slate-800 tracking-tight">Share with GradLeaf Campus Network</span>
              <p className="text-[11px] text-slate-500 font-medium">Post a project update, recruit peers, or ask technical questions</p>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3 pt-1">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What are you building or learning today? Looking for hackathon teammates?"
              rows={3}
              className="neu-input w-full text-xs p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-500 transition-all resize-none font-medium leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="neu-input text-xs font-bold bg-white/90 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Teammate Search">Teammate Search</option>
                  <option value="Project Milestone">Project Milestone</option>
                  <option value="Hackathon Update">Hackathon Update</option>
                  <option value="Tech Resource">Tech Resource</option>
                  <option value="General">General Discussion</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={posting || !newContent.trim()}
                className="btn-gradleaf-primary flex items-center gap-2 px-5 py-2 text-white rounded-xl text-xs font-bold shadow-tactile cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {posting ? 'Posting...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Feed Posts */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card rounded-3xl border border-slate-200 p-6 animate-pulse space-y-4 shadow-glass-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-16 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const hasLiked = currentUser && post.likes.some((l) => l.userId === currentUser.id);
              const isCommentOpen = activeCommentPostId === post.id;

              return (
                <article
                  key={post.id}
                  className="glass-card rounded-3xl border border-slate-200/80 p-6 shadow-glass-card hover:border-emerald-300 hover:shadow-tactile transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${post.user.id}`}>
                        <img
                          src={post.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/20 hover:opacity-85 transition-opacity shadow-tactile-subtle"
                        />
                      </Link>
                      <div>
                        <Link
                          href={`/profile/${post.user.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors"
                        >
                          {post.user.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {post.user.course} • {post.user.college}
                        </p>
                      </div>
                    </div>

                    {post.tag && (
                      <span
                        className={tagColors[post.tag] || tagColors.General}
                      >
                        {post.tag}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-3.5 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                    {post.content}
                  </div>

                  {/* Post Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                          hasLiked
                            ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-500/10'
                            : 'bg-white/80 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveCommentPostId(isCommentOpen ? null : post.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Comment Thread */}
                  {isCommentOpen && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                      {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-slate-100 text-xs shadow-2xs">
                          <img
                            src={c.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop'}
                            alt={c.user.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/20"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-slate-900">{c.user.name}</span>
                            <p className="text-slate-700 mt-0.5 leading-relaxed">{c.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Write a peer comment..."
                          className="neu-input flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="btn-gradleaf-primary p-2.5 text-white rounded-xl shadow-tactile cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Right Sidebar - Trending & Hackathons */}
      <aside className="lg:col-span-3 space-y-4">
        
        {/* GradLeaf Campus Badge */}
        <div className="btn-gradleaf-dark text-white rounded-3xl p-5 shadow-tactile-dark space-y-2 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <GradLeafLogo size={36} className="rounded-xl shadow-xs" />
            <div>
              <div className="text-xs font-extrabold text-white flex items-center gap-1 tracking-tight">
                Grad<span className="text-emerald-400">Leaf</span> Network
              </div>
              <p className="text-[10px] text-emerald-200/80 font-medium">Education today, growth tomorrow</p>
            </div>
          </div>
        </div>

        {/* Trending Skills Widget */}
        <div className="glass-card rounded-3xl border border-slate-200/80 p-5 shadow-glass-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Trending Campus Skills
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'Next.js', 'PyTorch', 'LangChain', 'Tailwind CSS', 'FastAPI', 'Go', 'Docker'].map((skill) => (
              <Link
                key={skill}
                href={`/graph?highlight=${encodeURIComponent(skill)}`}
                className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white/90 border border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:text-emerald-800 transition-colors shadow-2xs"
              >
                #{skill}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Project Widget */}
        <div className="glass-card rounded-3xl border border-emerald-200/80 p-5 shadow-glass-card bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="badge-enamel-green text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Recruiting Now
            </span>
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">AI-Powered Campus Assistant</h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            Multi-modal assistant for assignment scheduling & syllabus RAG QA.
          </p>
          <div className="mt-3">
            <Link
              href="/matching"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              Find matches for this project <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </aside>

    </div>
  );
}
