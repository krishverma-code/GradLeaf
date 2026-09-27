'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/userContext';
import { FALLBACK_USERS } from '@/lib/fallbackData';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { currentUser } = useUser();

  useEffect(() => {
    const targetId = currentUser?.id || FALLBACK_USERS[0].id;
    router.replace(`/profile/${targetId}`);
  }, [currentUser, router]);

  return (
    <div className="py-24 text-center space-y-3">
      <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm font-medium text-slate-500">Loading student profile...</p>
    </div>
  );
}
