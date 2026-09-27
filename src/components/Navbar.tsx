'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import {
  Compass,
  Briefcase,
  Users,
  Sparkles,
  Network,
  Bell,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  GraduationCap,
  Home,
} from 'lucide-react';
import GradLeafLogo from '@/components/GradLeafLogo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    allUsers,
    switchUser,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
  } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Feed', href: '/feed', icon: Compass },
    { label: 'Explore', href: '/explore', icon: Users },
    { label: 'Projects', href: '/projects', icon: Briefcase },
    {
      label: 'Smart Match',
      href: '/matching',
      icon: Sparkles,
      highlight: true,
    },
    { label: 'Skill Graph', href: '/graph', icon: Network },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),inset_0_-1px_0_0_rgba(255,255,255,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <GradLeafLogo size={38} className="rounded-xl shadow-xs group-hover:scale-105 transition-transform" />
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-0.5">
                Grad<span className="text-emerald-600">Leaf</span>
              </span>
              <span className="block text-[10px] text-emerald-800/80 font-bold tracking-wider uppercase">
                Student Network
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-[0_1px_2px_rgba(6,78,59,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                  {item.highlight && (
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs tracking-wider">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          
          {/* Account / Student Switcher */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(false);
                setShowUserMenu((prev) => !prev);
              }}
              className="flex items-center gap-2 text-xs bg-white/90 hover:bg-white border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-full transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] hover:border-slate-300"
              title="Switch active account"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
              <span className="font-bold text-slate-800">{currentUser?.name?.split(' ')[0] || 'Account'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Student Account
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserMenu(false);
                        if (pathname.startsWith('/profile')) {
                          router.push(`/profile/${u.id}`);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50/70 transition-colors ${
                        u.id === currentUser?.id ? 'bg-emerald-50 font-bold text-emerald-950' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-slate-900 leading-tight">{u.name}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{u.course}</div>
                        </div>
                      </div>
                      {u.id === currentUser?.id && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => {
                setShowUserMenu(false);
                setShowNotifications((prev) => !prev);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Notifications</h4>
                  {unreadCount > 0 ? (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer hover:underline transition-colors"
                    >
                      Mark all read
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">All caught up</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {currentUser?.notifications && currentUser.notifications.length > 0 ? (
                    currentUser.notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 hover:bg-slate-50 transition-colors text-xs cursor-pointer ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>}
                            <span>{n.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {(n.type === 'invitation' || n.title.toLowerCase().includes('match')) && (
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                                Match Request
                              </span>
                            )}
                            {!n.read && (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationRead(n.id);
                              setShowNotifications(false);
                            }}
                            className="inline-flex items-center gap-1 mt-2 text-emerald-700 font-semibold hover:underline text-[11px]"
                          >
                            {n.type === 'invitation' || n.title.toLowerCase().includes('match')
                              ? 'Review match request in profile'
                              : 'Open workspace / view'}{' '}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs">No notifications yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current Profile Link */}
          {currentUser && (
            <Link
              href={`/profile/${currentUser.id}`}
              className="flex items-center gap-2 pl-2 hover:opacity-85 transition-opacity"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 hover:ring-emerald-500/60 shadow-xs transition-all"
              />
              <span className="hidden lg:block text-xs font-bold text-slate-800">
                {currentUser.name}
              </span>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
