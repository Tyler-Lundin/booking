// hooks/useTimeSlotSelector.ts

'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { DateTime } from 'luxon';
import { Booking, Availability, EmbedSettings } from '@/types/database.types';

interface TimeSlotSelectorProps {
  embedId: string;
  selectedDate: string;
  onBookingComplete: boolean;
}

interface TimeSlot {
  start: string;
  end: string;
  isBooked: boolean;
}

interface EmbedSettingsData {
  min_booking_notice_hours?: number;
  // Add more flexible keys here as needed
}

interface EmbedSettingsWithParsedJson extends Omit<EmbedSettings, 'settings'> {
  settings: EmbedSettingsData | null;
}

export default function useTimeSlotSelector({ embedId, selectedDate, onBookingComplete }: TimeSlotSelectorProps) {
  const supabase = createBrowserSupabaseClient();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookings, setBookings] = useState<Pick<Booking, 'id' | 'start_time' | 'status'>[]>([]);
  const [embedSettings, setEmbedSettings] = useState<EmbedSettingsWithParsedJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (embedId) fetchEmbedSettings();
  }, [embedId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
      fetchBookings();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (onBookingComplete) {
      fetchAvailability();
      fetchBookings();
    }
  }, [onBookingComplete]);

  const fetchEmbedSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .eq('id', embedId)
        .single();

      if (error) throw error;

      const parsed: EmbedSettingsWithParsedJson = {
        ...data,
        settings: typeof data.settings === 'object' && data.settings !== null
          ? (data.settings as EmbedSettingsData)
          : null,
      };

      setEmbedSettings(parsed);
    } catch (err) {
      console.error('Failed to load embed settings:', err);
    }
  };

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAvailability(data || []);
    } catch (err) {
      console.error('Failed to load availability:', err);
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!selectedDate) return;
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, start_time, status')
        .eq('date', selectedDate)
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const getTimeSlots = (): TimeSlot[] => {
    if (!selectedDate) return [];

    const date = DateTime.fromISO(selectedDate);
    const dayOfWeek = date.weekday % 7;
    const dailySlots = availability.filter(slot => slot.day_of_week === dayOfWeek);

    if (dailySlots.length === 0) return [];

    let validSlots = dailySlots;

    const noticeHours = embedSettings?.settings?.min_booking_notice_hours;
    if (noticeHours !== undefined) {
      const now = DateTime.now();
      const minNoticeTime = now.plus({ hours: noticeHours });

      validSlots = validSlots.filter(slot => {
        const slotTime = DateTime.fromISO(`${selectedDate}T${slot.start_time}`);
        return slotTime >= minNoticeTime;
      });
    }

    return validSlots.map(slot => ({
      start: slot.start_time,
      end: slot.end_time,
      isBooked: bookings.some(b => b.start_time === slot.start_time),
    }));
  };

  return {
    availability,
    bookings,
    timeSlots: getTimeSlots(),
    loading,
    error,
    embedSettings,
  };
}