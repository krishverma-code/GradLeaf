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
  projectMembers?: { id?: string; role?: string; project: any }[];
  ownedProjects?: any[];
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
  addNotification: (notif: {
    userId: string;
    title: string;
    message: string;
    link?: string | null;
    type?: string;
  }) => void;
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
  addNotification: () => {},
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
      let customNotifications: any[] = [];
      let readNotificationIds: string[] = [];
      let collabStatuses: Record<string, string> = {};
      let customMemberships: any[] = [];
      let customProjects: any[] = [];

      if (typeof window !== 'undefined') {
        try {
          const storedCustom = localStorage.getItem('gradleaf_custom_users');
          if (storedCustom) customUsers = JSON.parse(storedCustom);
          const storedDeleted = localStorage.getItem('gradleaf_deleted_user_ids');
          if (storedDeleted) deletedIds = JSON.parse(storedDeleted);
          const rawNotifs = localStorage.getItem('gradleaf_custom_notifications');
          if (rawNotifs) customNotifications = JSON.parse(rawNotifs);
          const rawRead = localStorage.getItem('gradleaf_read_notifications');
          if (rawRead) readNotificationIds = JSON.parse(rawRead);
          const rawStatuses = localStorage.getItem('gradleaf_collab_statuses');
          if (rawStatuses) collabStatuses = JSON.parse(rawStatuses);
          const rawMems = localStorage.getItem('gradleaf_custom_memberships');
          if (rawMems) customMemberships = JSON.parse(rawMems);
          const rawProj = localStorage.getItem('gradleaf_custom_projects');
          if (rawProj) customProjects = JSON.parse(rawProj);
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
        // Collabs
        const myCollabs = customCollabs.filter((c: any) => c.receiverId === u.id || c.receiver?.id === u.id);
        const existingCollabs = u.receivedCollab || [];
        const combinedCollabs = [...myCollabs, ...existingCollabs].map((c: any) => ({
          ...c,
          status: collabStatuses[c.id] || c.status || 'pending',
        }));
        const uniqueCollabs = combinedCollabs.filter((c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx);

        // Contributing Memberships
        const existingMembers = u.projectMembers || [];
        const relevantCustomMems = customMemberships.filter((m: any) => m.userId === u.id);
        const acceptedCollabMembers = uniqueCollabs
          .filter((c: any) => c.status === 'accepted' && c.project)
          .map((c: any) => ({
            id: 'mem_collab_' + c.id,
            role: c.role || 'Contributor',
            project: c.project,
          }));
        const rawMembers = [...existingMembers, ...relevantCustomMems, ...acceptedCollabMembers];
        const uniqueMembers = rawMembers.filter(
          (m, idx, arr) => arr.findIndex((x) => x.project?.id === m.project?.id) === idx
        );

        // Owned Projects
        const existingOwned = u.ownedProjects || [];
        const userCustomProjects = customProjects.filter((p: any) => p.ownerId === u.id);
        const uniqueOwned = [...existingOwned, ...userCustomProjects].filter(
          (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx
        );

        // Notifications
        const userCustomNotifs = customNotifications.filter((n: any) => n.userId === u.id);
        const serverNotifs = u.notifications || [];
        const pendingCollabNotifs = uniqueCollabs
          .filter((c: any) => c.status === 'pending')
          .map((c: any) => ({
            id: 'notif_collab_' + c.id,
            userId: u.id,
            title: 'New Match Request!',
            message: `${c.sender?.name || 'A teammate'} sent you a match request to join "${c.project?.title || 'a project'}" as ${c.role || 'Teammate'}.`,
            link: `/profile/${u.id}`,
            type: 'invitation',
            read: readNotificationIds.includes('notif_collab_' + c.id),
            createdAt: c.createdAt || new Date().toISOString(),
          }));

        const allUserNotifs = [...userCustomNotifs, ...pendingCollabNotifs, ...serverNotifs]
          .map((n: any) => ({
            ...n,
            read: n.read || readNotificationIds.includes(n.id),
          }))
          .filter((n, idx, arr) => arr.findIndex((x) => x.id === n.id) === idx)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
          ...u,
          receivedCollab: uniqueCollabs,
          projectMembers: uniqueMembers,
          ownedProjects: uniqueOwned,
          notifications: allUserNotifs,
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

  const addNotification = (notif: {
    userId: string;
    title: string;
    message: string;
    link?: string | null;
    type?: string;
  }) => {
    const fullNotif = {
      id: 'notif_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      userId: notif.userId,
      title: notif.title,
      message: notif.message,
      link: notif.link || null,
      type: notif.type || 'invitation',
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('gradleaf_custom_notifications');
        const list = raw ? JSON.parse(raw) : [];
        localStorage.setItem('gradleaf_custom_notifications', JSON.stringify([fullNotif, ...list]));
      } catch (err) {
        console.error('Failed saving custom notification', err);
      }
    }

    // Live state update
    setCurrentUser((prev) => {
      if (!prev || prev.id !== notif.userId) return prev;
      return {
        ...prev,
        notifications: [fullNotif, ...(prev.notifications || [])],
      };
    });

    setAllUsers((prevList) =>
      prevList.map((u) => {
        if (u.id !== notif.userId) return u;
        return {
          ...u,
          notifications: [fullNotif, ...(u.notifications || [])],
        };
      })
    );
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    const currentNotifIds = (currentUser.notifications || []).map((n) => n.id);

    if (typeof window !== 'undefined') {
      try {
        const rawRead = localStorage.getItem('gradleaf_read_notifications');
        const readIds: string[] = rawRead ? JSON.parse(rawRead) : [];
        const combinedRead = Array.from(new Set([...readIds, ...currentNotifIds]));
        localStorage.setItem('gradleaf_read_notifications', JSON.stringify(combinedRead));

        const rawCustom = localStorage.getItem('gradleaf_custom_notifications');
        if (rawCustom) {
          const list = JSON.parse(rawCustom);
          const updated = list.map((n: any) =>
            n.userId === currentUser.id ? { ...n, read: true } : n
          );
          localStorage.setItem('gradleaf_custom_notifications', JSON.stringify(updated));
        }
      } catch {}
    }

    // Optimistic UI update
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        notifications: prev.notifications?.map((n) => ({ ...n, read: true })) || [],
      };
    });

    setAllUsers((prevList) =>
      prevList.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          notifications: u.notifications?.map((n) => ({ ...n, read: true })) || [],
        };
      })
    );

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

    if (typeof window !== 'undefined') {
      try {
        const rawRead = localStorage.getItem('gradleaf_read_notifications');
        const readIds: string[] = rawRead ? JSON.parse(rawRead) : [];
        if (!readIds.includes(notificationId)) {
          readIds.push(notificationId);
          localStorage.setItem('gradleaf_read_notifications', JSON.stringify(readIds));
        }

        const rawCustom = localStorage.getItem('gradleaf_custom_notifications');
        if (rawCustom) {
          const list = JSON.parse(rawCustom);
          const updated = list.map((n: any) =>
            n.id === notificationId ? { ...n, read: true } : n
          );
          localStorage.setItem('gradleaf_custom_notifications', JSON.stringify(updated));
        }
      } catch {}
    }

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

    setAllUsers((prevList) =>
      prevList.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          notifications: u.notifications?.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ) || [],
        };
      })
    );

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
        addNotification,
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
