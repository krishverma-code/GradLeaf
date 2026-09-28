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

export interface CreateProfileInput {
  name: string;
  email?: string;
  college: string;
  course: string;
  year?: number;
  headline?: string;
  bio?: string;
  interests?: string;
  availability?: string;
  avatarUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  skills?: { name: string; category?: string; status?: string; proficiency?: number }[];
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
  createProfile: (data: CreateProfileInput) => Promise<StudentUser>;
  removeProfile: (userId: string) => Promise<boolean>;
  showCreateProfileModal: boolean;
  setShowCreateProfileModal: (show: boolean) => void;
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
  createProfile: async () => FALLBACK_USERS[0] as any,
  removeProfile: async () => true,
  showCreateProfileModal: false,
  setShowCreateProfileModal: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(FALLBACK_USERS[0] as any);
  const [allUsers, setAllUsers] = useState<StudentUser[]>(FALLBACK_USERS as any);
  const [loading, setLoading] = useState(false);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  const fetchUsers = async () => {
    try {
      let customUsers: StudentUser[] = [];
      let deletedIds: string[] = [];
      if (typeof window !== 'undefined') {
        try {
          const storedCustom = localStorage.getItem('gradleaf_custom_users');
          if (storedCustom) customUsers = JSON.parse(storedCustom);
          const storedDeleted = localStorage.getItem('gradleaf_deleted_user_ids');
          if (storedDeleted) deletedIds = JSON.parse(storedDeleted);
        } catch {
          // ignore localStorage JSON error
        }
      }

      let serverUsers: StudentUser[] = [];
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            serverUsers = data;
          }
        }
      } catch (err) {
        console.warn('Could not fetch server users, using fallback dataset', err);
      }

      let customCollabs: any[] = [];
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('gradleaf_custom_collabs');
          if (raw) customCollabs = JSON.parse(raw);
        } catch {}
      }

      const baseList = serverUsers.length > 0 ? serverUsers : FALLBACK_USERS;
      const activeServerUsers = baseList.filter((u: any) => !deletedIds.includes(u.id));
      const validCustomUsers = customUsers.filter(
        (cu: any) => !activeServerUsers.some((su: any) => su.id === cu.id) && !deletedIds.includes(cu.id)
      );

      const mergedUsers = [...validCustomUsers, ...activeServerUsers].map((u: any) => {
        const myCollabs = customCollabs.filter((c: any) => c.receiverId === u.id || c.receiver?.id === u.id);
        const existing = u.receivedCollab || [];
        const combined = [...myCollabs, ...existing];
        return {
          ...u,
          receivedCollab: combined.filter((c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx),
        };
      });
      const finalUsers = mergedUsers.length > 0 ? mergedUsers : [FALLBACK_USERS[0]];
      setAllUsers(finalUsers as any);

      const savedId =
        typeof window !== 'undefined'
          ? localStorage.getItem('gradleaf_active_user') || localStorage.getItem('skillsync_active_user')
          : null;
      const found = finalUsers.find((u: any) => u.id === savedId) || finalUsers[0];
      setCurrentUser(found as any);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gradleaf_active_user', found.id);
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

  const createProfile = async (data: CreateProfileInput): Promise<StudentUser> => {
    let createdUser: StudentUser;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        createdUser = await res.json();
      } else {
        throw new Error('Server returned error');
      }
    } catch {
      // Fallback synthetic creation for offline/serverless Vercel
      const synthId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      createdUser = {
        id: synthId,
        name: data.name,
        email: data.email || `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}-${Date.now()}@campus.edu`,
        college: data.college,
        course: data.course,
        department: null,
        year: typeof data.year === 'number' ? data.year : 2,
        headline: data.headline || `${data.course} Student at ${data.college}`,
        bio: data.bio || 'Building collaborative student innovations on GradLeaf.',
        interests: data.interests || 'Web Development, AI',
        availability: data.availability || '15 hrs/week (Flexible)',
        avatarUrl:
          data.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        githubUrl: data.githubUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        skills: Array.isArray(data.skills)
          ? data.skills.map((s: any, idx: number) => ({
              id: 'sk_' + idx + '_' + synthId,
              status: s.status || 'Comfortable',
              proficiency: s.proficiency || 4,
              skill: {
                id: 'skill_' + idx,
                name: typeof s === 'string' ? s : s.name,
                category: s.category || 'Frontend',
              },
            }))
          : [],
        notifications: [],
        receivedCollab: [],
      };
    }

    // Persist to custom users in localStorage
    if (typeof window !== 'undefined') {
      try {
        const storedCustom = localStorage.getItem('gradleaf_custom_users');
        const customList: StudentUser[] = storedCustom ? JSON.parse(storedCustom) : [];
        const updatedCustom = [createdUser, ...customList.filter((u) => u.id !== createdUser.id)];
        localStorage.setItem('gradleaf_custom_users', JSON.stringify(updatedCustom));
        localStorage.setItem('gradleaf_active_user', createdUser.id);

        // Also ensure not in deleted list if re-added
        const storedDeleted = localStorage.getItem('gradleaf_deleted_user_ids');
        if (storedDeleted) {
          const deletedList: string[] = JSON.parse(storedDeleted);
          localStorage.setItem(
            'gradleaf_deleted_user_ids',
            JSON.stringify(deletedList.filter((id) => id !== createdUser.id))
          );
        }
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    }

    // Update state immediately
    setAllUsers((prev) => [createdUser, ...prev.filter((u) => u.id !== createdUser.id)]);
    setCurrentUser(createdUser);
    return createdUser;
  };

  const removeProfile = async (userId: string): Promise<boolean> => {
    try {
      fetch(`/api/users/${userId}`, { method: 'DELETE' }).catch(() => {});
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      try {
        // Add to deleted IDs
        const storedDeleted = localStorage.getItem('gradleaf_deleted_user_ids');
        const deletedList: string[] = storedDeleted ? JSON.parse(storedDeleted) : [];
        if (!deletedList.includes(userId)) {
          deletedList.push(userId);
          localStorage.setItem('gradleaf_deleted_user_ids', JSON.stringify(deletedList));
        }

        // Remove from custom users
        const storedCustom = localStorage.getItem('gradleaf_custom_users');
        if (storedCustom) {
          const customList: StudentUser[] = JSON.parse(storedCustom);
          localStorage.setItem(
            'gradleaf_custom_users',
            JSON.stringify(customList.filter((u) => u.id !== userId))
          );
        }
      } catch (err) {
        console.error('Failed to update localStorage upon removal', err);
      }
    }

    // Update React state
    setAllUsers((prev) => {
      const remaining = prev.filter((u) => u.id !== userId);
      const safeRemaining = remaining.length > 0 ? remaining : (FALLBACK_USERS as any);
      if (currentUser?.id === userId) {
        const nextUser = safeRemaining[0];
        setCurrentUser(nextUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gradleaf_active_user', nextUser.id);
        }
      }
      return safeRemaining;
    });

    return true;
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
        createProfile,
        removeProfile,
        showCreateProfileModal,
        setShowCreateProfileModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
