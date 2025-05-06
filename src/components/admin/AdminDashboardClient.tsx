'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function AdminDashboardClient() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      const { data: userProfile } = await supabase.auth.getUser();
      if (userProfile?.user?.user_metadata?.role !== 'admin') {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  return null;
} 