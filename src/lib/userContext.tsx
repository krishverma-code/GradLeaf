'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  college: string;
  course: string;
  department: string | null;
  year: number;
  headline: string | null;
  bio: string | null;
  interests: string | null;
  availability: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  skills?: {
    id: string;
    status: string;
    proficiency: number;
    skill: { id: string; name: string; category: string };
  }[];
  notifications?: {
    id: string;
    title: string;
    message: string;
    link: string | null;
    type: string;
    read: boolean;
    createdAt: string;
  }[];
  receivedCollab?: {
    id: string;
    projectId: string;
    senderId: string;
    receiverId: string;
    role: string;
    message: string | null;
    status: string;
    createdAt: string;
    project: { id: string; title: string; domain: string };
    sender: { id: string; name: string; avatarUrl: string | null; course: string; college: string };
  }[];
}

interface UserContextType {
  currentUser: StudentUser | null;
  allUsers: StudentUser[];
  loading: boolean;
  switchUser: (userId: string) => void;
  refreshUsers: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  unreadCount: number;
}

import { FALLBACK_USERS } from '@/lib/fallbackData';

const UserContext = createContext<UserContextType>({
  currentUser: FALLBACK_USERS[0] as any,
  allUsers: FALLBACK_USERS as any,
  loading: false,
  switchUser: () => {},
  refreshUsers: async () => {},
  markAllNotificationsRead: async () => {},
  markNotificationRead: async () => {},
  unreadCount: 0,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(FALLBACK_USERS[0] as any);
  const [allUsers, setAllUsers] = useState<StudentUser[]>(FALLBACK_USERS as any);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users) && users.length > 0) {
          setAllUsers(users);
          const savedId = typeof window !== 'undefined' ? (localStorage.getItem('gradleaf_active_user') || localStorage.getItem('skillsync_active_user')) : null;
          const found = users.find((u: StudentUser) => u.id === savedId) || users[0];
          setCurrentUser(found);
          if (typeof window !== 'undefined' && (!savedId || !users.some((u: any) => u.id === savedId))) {
            localStorage.setItem('gradleaf_active_user', found.id);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load users, keeping fallback dataset', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gradleaf_active_user', userId);
      }
    }
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    // Optimistic UI update
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: prev.notifications?.map((n) => ({ ...n, read: true })) || [],
      };
    });

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
    } catch (e) {
      console.error('Failed to mark all notifications read', e);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!currentUser) return;
    // Optimistic UI update
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: prev.notifications?.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ) || [],
      };
    });

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, notificationId }),
      });
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  const unreadCount = currentUser?.notifications?.filter((n) => !n.read).length || 0;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        loading,
        switchUser,
        refreshUsers: fetchUsers,
        markAllNotificationsRead,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
