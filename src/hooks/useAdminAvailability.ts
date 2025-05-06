'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

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
  interval: number;
}

interface GroupedTimeSlot {
  start_time: string;
  end_time: string;
  buffer_minutes: number;
  days: number[];
  slots: TimeSlot[];
}

export default function useAdminAvailability() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [groupedSlots, setGroupedSlots] = useState<GroupedTimeSlot[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: '09:00',
    end: '17:00',
    interval: 60,
  });

  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];

  // Load user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push('/auth');
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, [supabase, router]);

  const fetchTimeSlots = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimeSlots();
    }
  }, [selectedDays, user]);

  useEffect(() => {
    if (!timeSlots.length) return setGroupedSlots([]);

    const grouped = timeSlots.reduce((acc: GroupedTimeSlot[], slot) => {
      const existingGroup = acc.find(
        g =>
          g.start_time === slot.start_time &&
          g.end_time === slot.end_time &&
          g.buffer_minutes === slot.buffer_minutes
      );

      if (existingGroup) {
        existingGroup.days.push(slot.day_of_week);
        existingGroup.slots.push(slot);
      } else {
        acc.push({
          start_time: slot.start_time,
          end_time: slot.end_time,
          buffer_minutes: slot.buffer_minutes,
          days: [slot.day_of_week],
          slots: [slot],
        });
      }
      return acc;
    }, []);

    grouped.forEach(g => g.days.sort((a, b) => a - b));
    setGroupedSlots(grouped);
  }, [timeSlots]);

  const handleDayToggle = async (group: GroupedTimeSlot, dayId: number) => {
    if (!user) return;

    const existing = group.slots.find(s => s.day_of_week === dayId);
    if (existing) {
      const { error } = await supabase.from('availability').delete().eq('id', existing.id);
      if (error) return console.error('Error deleting availability:', error);
      setTimeSlots(prev => prev.filter(s => s.id !== existing.id));
    } else {
      const { data, error } = await supabase
        .from('availability')
        .insert([
          {
            start_time: group.start_time,
            end_time: group.end_time,
            buffer_minutes: group.buffer_minutes,
            day_of_week: dayId,
            user_id: user.id,
          },
        ])
        .select();

      if (error) return console.error('Error inserting availability:', error);
      if (data) setTimeSlots(prev => [...prev, data[0]]);
    }
  };

  const handleUpdateTimeRange = async (
    group: GroupedTimeSlot,
    field: 'start_time' | 'end_time' | 'buffer_minutes',
    value: string | number
  ) => {
    if (!user) return;
    const { error } = await supabase
      .from('availability')
      .update({ [field]: value })
      .in('id', group.slots.map(s => s.id));

    if (error) return console.error('Update failed:', error);

    setTimeSlots(prev =>
      prev.map(slot => (group.slots.find(s => s.id === slot.id) ? { ...slot, [field]: value } : slot))
    );
  };

  const handleDeleteGroup = async (group: GroupedTimeSlot) => {
    if (!user) return;
    const { error } = await supabase
      .from('availability')
      .delete()
      .in('id', group.slots.map(s => s.id));
    if (error) return console.error('Error deleting slots:', error);
    setTimeSlots(prev => prev.filter(s => !group.slots.some(g => g.id === s.id)));
  };

  const handlePopulateTimeSlots = async () => {
    if (!user || selectedDays.length === 0) return;

    const [startHour, startMinute] = timeRange.start.split(':').map(Number);
    const [endHour, endMinute] = timeRange.end.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    const { error: delError } = await supabase
      .from('availability')
      .delete()
      .in('day_of_week', selectedDays)
      .eq('user_id', user.id);
    if (delError) return console.error('Error clearing old slots:', delError);

    const newSlots: TimeSlot[] = [];
    selectedDays.forEach(day => {
      for (let time = start; time < end; time += timeRange.interval) {
        const sTime = `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}:00`;
        const eTime = `${String(Math.floor((time + timeRange.interval) / 60)).padStart(2, '0')}:${String((time + timeRange.interval) % 60).padStart(2, '0')}:00`;
        newSlots.push({
          start_time: sTime,
          end_time: eTime,
          day_of_week: day,
          buffer_minutes: 15,
          user_id: user.id,
        });
      }
    });

    const { data, error } = await supabase.from('availability').insert(newSlots).select();
    if (error) return console.error('Insert error:', error);
    if (data) setTimeSlots(data);
  };

  const handleToggleAllDays = () => {
    setSelectedDays(prev => (prev.length === daysOfWeek.length ? [] : daysOfWeek.map(d => d.id)));
  };

  const handleResetAll = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('availability').delete().eq('user_id', user.id);
    if (error) console.error('Error resetting:', error);
    setTimeSlots([]);
    setSelectedDays([]);
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/auth');
    setLoading(false);
  };

  return {
    groupedSlots,
    selectedDays,
    showControls,
    loading,
    timeRange,
    daysOfWeek,
    setShowControls,
    setTimeRange,
    handleToggleAllDays,
    handleDayToggle,
    handleUpdateTimeRange,
    handleDeleteGroup,
    handleResetAll,
    handleSignOut,
    handlePopulateTimeSlots,
  };
}
