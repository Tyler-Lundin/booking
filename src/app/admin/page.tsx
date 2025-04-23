'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { PostgrestError } from '@supabase/supabase-js';

interface UserData {
  full_name: string | null;
  role: string;
}

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'completed';
  notes: string | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0
  });
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    console.log('Admin Dashboard - Fetching user data for user:', user.id);
    supabase
      .from('users')
      .select('full_name, role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }: { data: UserData | null; error: PostgrestError | null }) => {
        if (error) {
          console.error('Admin Dashboard - Error fetching user data:', error);
          setLoading(false);
          return;
        }
        console.log('Admin Dashboard - User data:', data);
        setUserData(data);
        
        if (data?.role !== 'admin') {
          console.log('Admin Dashboard - User is not an admin, redirecting to dashboard');
          router.push('/dashboard');
        }
        setLoading(false);
      });
  }, [user, router, authLoading]);

  useEffect(() => {
    if (!authLoading && userData?.role === 'admin') {
      fetchBookings();
    }
  }, [userData?.role, authLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false })
        .order('start_time', { ascending: false })
        .limit(5);

      if (error) throw error;
      setBookings(data || []);

      // Calculate statistics
      const { data: allBookings, error: statsError } = await supabase
        .from('bookings')
        .select('status');

      if (statsError) throw statsError;

      const newStats = {
        total: allBookings?.length || 0,
        pending: allBookings?.filter((b: Booking) => b.status === 'pending').length || 0,
        confirmed: allBookings?.filter((b: Booking) => b.status === 'confirmed').length || 0,
        cancelled: allBookings?.filter((b: Booking) => b.status === 'cancelled').length || 0,
        completed: allBookings?.filter((b: Booking) => b.status === 'completed').length || 0
      };

      setStats(newStats);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !userData || userData.role !== 'admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/admin/bookings')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage Bookings
              </button>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-indigo-900">Total Bookings</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900">Confirmed</h3>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900">Completed</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
              <div className="mt-4">
                {bookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent bookings to display.</p>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <li key={booking.id} className="px-4 py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">
                                {booking.name || 'Unknown User'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.email || 'No email'}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(booking.date)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
} 