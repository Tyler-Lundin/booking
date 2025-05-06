'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { DateTime } from 'luxon';
import { getDatabaseDayOfWeek } from '@/utils/date';

export default function useAvailableDates(embedId: string | undefined) {
  const supabase = createBrowserSupabaseClient();
  const [availability, setAvailability] = useState<{ id: string; day_of_week: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (embedId) fetchAvailability();
  }, [embedId]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('id, day_of_week')
        .eq('', embedId)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) {
        console.warn('No availability found for embedId:', embedId);
      }
      setAvailability(data || []);
    } catch (err) {
      console.error('Error loading availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date: DateTime) => {
    const dayOfWeek = getDatabaseDayOfWeek(date); // Sunday = 0
    const matched = availability.some(slot => slot.day_of_week === dayOfWeek);
    return matched;
  };

  return {
    availability,
    loading,
    error,
    isDateAvailable,
  };
}
