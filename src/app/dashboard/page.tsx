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
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      console.log('Dashboard - Fetching user data for user:', user.id);
      supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }: { data: UserData | null; error: PostgrestError | null }) => {
          if (error) {
            console.error('Dashboard - Error fetching user data:', error);
            setLoading(false);
            return;
          }
          console.log('Dashboard - User data:', data);
          setUserData(data);
          
          // Check if user is admin
          if (data?.role === 'admin') {
            console.log('Dashboard - User is an admin, redirecting to admin dashboard');
            router.push('/admin');
          } else {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
              
              {user && userData && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">User Information</h2>
                    <p className="mt-1 text-sm text-gray-500">Email: {user.email}</p>
                    <p className="mt-1 text-sm text-gray-500">Role: {userData.role}</p>
                    {userData.full_name && (
                      <p className="mt-1 text-sm text-gray-500">Name: {userData.full_name}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">ID: {user.id}</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 