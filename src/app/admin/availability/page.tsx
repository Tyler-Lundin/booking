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

interface TimeSlot {
  id?: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  buffer_minutes: number;
  user_id: string;
}

interface TimeRange {
  start: string;
  end: string;
  interval: number; // in minutes
}

export default function AdminAvailabilityPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: '09:00',
    end: '17:00',
    interval: 60
  });
  const supabase = createClient();

  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];

  useEffect(() => {
    if (user) {
      console.log('Admin Availability - Fetching user data for user:', user.id);
      supabase
        .from('users')
        .select('full_name, role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }: { data: UserData | null; error: PostgrestError | null }) => {
          if (error) {
            console.error('Admin Availability - Error fetching user data:', error);
            return;
          }
          console.log('Admin Availability - User data:', data);
          setUserData(data);
          
          if (data?.role !== 'admin') {
            console.log('Admin Availability - User is not an admin, redirecting to dashboard');
            router.push('/dashboard');
          }
        });
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchTimeSlots();
    }
  }, [selectedDays, user]);

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('user_id', user?.id)
        .order('start_time', { ascending: true })

      if (error) throw error
      setTimeSlots(data || [])
    } catch (err) {
      console.error('Error fetching time slots:', err)
    }
  }

  useEffect(() => {
    fetchTimeSlots()
  }, [selectedDays, user, supabase])

  const handleAddTimeSlot = async () => {
    if (!user) return;

    const newSlot: TimeSlot = {
      start_time: '09:00:00',
      end_time: '10:00:00',
      day_of_week: selectedDays[0],
      buffer_minutes: 30,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('availability')
      .insert([newSlot])
      .select();

    if (error) {
      console.error('Error adding availability:', error);
      return;
    }

    if (data) {
      setTimeSlots([...timeSlots, data[0]]);
    }
  };

  const handleUpdateTimeSlot = async (index: number, field: keyof TimeSlot, value: string | number) => {
    const slot = timeSlots[index];
    if (!slot || !slot.id) return;

    const { error } = await supabase
      .from('availability')
      .update({ [field]: value })
      .eq('id', slot.id);

    if (error) {
      console.error('Error updating availability:', error);
      return;
    }

    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { ...slot, [field]: value };
    setTimeSlots(updatedSlots);
  };

  const handleDeleteTimeSlot = async (index: number) => {
    const slot = timeSlots[index];
    if (!slot || !slot.id) return;

    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', slot.id);

    if (error) {
      console.error('Error deleting availability:', error);
      return;
    }

    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedSlots);
  };

  const handlePopulateTimeSlots = async () => {
    if (!user || selectedDays.length === 0) return;

    try {
      console.log('Populating slots for days:', selectedDays, 'user:', user.id);
      
      // Clear existing slots for selected days
      const { error: deleteError } = await supabase
        .from('availability')
        .delete()
        .in('day_of_week', selectedDays)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error clearing existing slots:', deleteError);
        return;
      }

      // Convert time strings to minutes
      const [startHour, startMinute] = timeRange.start.split(':').map(Number);
      const [endHour, endMinute] = timeRange.end.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      console.log('Creating slots from', startMinutes, 'to', endMinutes, 'with interval', timeRange.interval);

      // Create slots for each selected day
      const newSlots: TimeSlot[] = [];
      selectedDays.forEach(day => {
        for (let time = startMinutes; time < endMinutes; time += timeRange.interval) {
          const startTime = new Date();
          startTime.setHours(Math.floor(time / 60), time % 60, 0);
          
          const endTime = new Date();
          endTime.setHours(Math.floor((time + timeRange.interval) / 60), (time + timeRange.interval) % 60, 0);

          const slot = {
            start_time: startTime.toTimeString().slice(0, 8),
            end_time: endTime.toTimeString().slice(0, 8),
            day_of_week: day,
            buffer_minutes: 15,
            user_id: user.id
          };
          
          console.log('Creating slot:', slot);
          newSlots.push(slot);
        }
      });

      // Insert all new slots in a single batch
      if (newSlots.length > 0) {
        console.log('Inserting', newSlots.length, 'slots');
        const { data, error } = await supabase
          .from('availability')
          .insert(newSlots)
          .select();

        if (error) {
          console.error('Error populating time slots:', error);
          return;
        }

        if (data) {
          console.log('Successfully inserted slots:', data);
          setTimeSlots(data);
        }
      }
    } catch (error) {
      console.error('Error in handlePopulateTimeSlots:', error);
    }
  };

  const handleDayToggle = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleToggleAllDays = () => {
    setSelectedDays(prev => 
      prev.length === daysOfWeek.length 
        ? [] 
        : daysOfWeek.map(day => day.id)
    );
  };

  const handleResetAll = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error resetting availability:', error);
        return;
      }

      setTimeSlots([]);
      setSelectedDays([]);
    } catch (error) {
      console.error('Error in handleResetAll:', error);
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
                    <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>

                  {userData && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600">
                        Logged in as {userData.full_name} ({userData.role})
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Days
                      </label>
                      <button
                        onClick={handleToggleAllDays}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        {selectedDays.length === daysOfWeek.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => handleDayToggle(day.id)}
                          className={`
                            p-2 rounded-md text-center
                            ${selectedDays.includes(day.id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {day.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Populate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <input
                          type="time"
                          id="start-time"
                          value={timeRange.start}
                          onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                          End Time
                        </label>
                        <input
                          type="time"
                          id="end-time"
                          value={timeRange.end}
                          onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
                          Interval (minutes)
                        </label>
                        <select
                          id="interval"
                          value={timeRange.interval}
                          onChange={(e) => setTimeRange({ ...timeRange, interval: Number(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="90">1.5 hours</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={handlePopulateTimeSlots}
                        disabled={selectedDays.length === 0}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        Populate Time Slots
                      </button>
                      <button
                        onClick={handleResetAll}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Reset All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {timeSlots.map((slot, index) => (
                      <div key={slot.id || index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => handleUpdateTimeSlot(index, 'start_time', e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => handleUpdateTimeSlot(index, 'end_time', e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          value={slot.buffer_minutes}
                          onChange={(e) => handleUpdateTimeSlot(index, 'buffer_minutes', Number(e.target.value))}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Buffer (min)"
                        />
                        <button
                          onClick={() => handleDeleteTimeSlot(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddTimeSlot}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Time Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 