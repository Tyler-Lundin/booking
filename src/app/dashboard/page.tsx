'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PostgrestError } from '@supabase/supabase-js';

interface UserData {
  full_name: string | null;
  role: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    supabase
      .from('users')
      .select('full_name, role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }: { data: UserData | null; error: PostgrestError | null }) => {
        if (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
          return;
        }
        setUserData(data);
        setLoading(false);
      });
  }, [user, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back{userData?.full_name ? `, ${userData.full_name}` : ''}!
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 