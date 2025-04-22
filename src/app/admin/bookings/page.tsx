'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { PostgrestError } from '@supabase/supabase-js';
import { DateTime } from 'luxon';

interface UserData {
  full_name: string;
  role: string;
}

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'completed';
  notes: string | null;
  user_id: string;
  user: {
    full_name: string;
    email: string;
  };
}

type BookingFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'completed';

export default function AdminBookingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      console.log('Admin Bookings - Fetching user data for user:', user.id);
      supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }: { data: UserData | null; error: PostgrestError | null }) => {
          if (error) {
            console.error('Admin Bookings - Error fetching user data:', error);
            return;
          }
          console.log('Admin Bookings - User data:', data);
          setUserData(data);
          
          if (data?.role !== 'admin') {
            console.log('Admin Bookings - User is not an admin, redirecting to dashboard');
            router.push('/dashboard');
          }
        });
    }
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false })
        .order('start_time', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [filter, supabase])

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    setUpdatingStatus(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setUpdatingStatus(null);
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
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
  };

  const formatTime = (time: string) => {
    return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('h:mm a');
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                    <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
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
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          {(['all', 'pending', 'confirmed', 'cancelled', 'no-show', 'completed'] as BookingFilter[]).map((status) => (
                            <button 
                              key={status}
                              onClick={() => setFilter(status)}
                              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                                filter === status 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                          <ul className="divide-y divide-gray-200">
                            {bookings.length === 0 ? (
                              <li className="px-6 py-4">
                                <p className="text-sm text-gray-500">No bookings found.</p>
                              </li>
                            ) : (
                              bookings.map((booking) => (
                                <li key={booking.id} className="px-6 py-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {booking.user.full_name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {booking.user.email}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatDate(booking.date)}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                      </span>
                                      {booking.notes && (
                                        <p className="text-sm text-gray-500">
                                          Notes: {booking.notes}
                                        </p>
                                      )}
                                    </div>
                                    <select
                                      value={booking.status}
                                      onChange={(e) => handleStatusUpdate(booking.id, e.target.value as Booking['status'])}
                                      disabled={updatingStatus === booking.id}
                                      className={`ml-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                        updatingStatus === booking.id ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirmed</option>
                                      <option value="cancelled">Cancelled</option>
                                      <option value="no-show">No Show</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
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