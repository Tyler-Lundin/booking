'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { PostgrestError } from '@supabase/supabase-js';

interface UserData {
  full_name: string | null;
  role: string;
}

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      console.log('Admin Dashboard - Fetching user data for user:', user.id);
      supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }: { data: UserData | null; error: PostgrestError | null }) => {
          if (error) {
            console.error('Admin Dashboard - Error fetching user data:', error);
            return;
          }
          console.log('Admin Dashboard - User data:', data);
          setUserData(data);
          
          if (data?.role !== 'admin') {
            console.log('Admin Dashboard - User is not an admin, redirecting to dashboard');
            router.push('/dashboard');
          }
        });
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                  
                  {user && userData && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-indigo-900">Total Bookings</h3>
                          <p className="text-3xl font-bold text-indigo-600">0</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-green-900">Active Users</h3>
                          <p className="text-3xl font-bold text-green-600">0</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-purple-900">Revenue</h3>
                          <p className="text-3xl font-bold text-purple-600">$0</p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">No recent activity to display.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 