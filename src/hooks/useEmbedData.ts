"use client"

import * as React from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { getAvailabilityForMonth } from '@/app/actions/availability';
import { AvailabilityStatus } from '@/app/actions/availability';
import { DateTime } from 'luxon';

type Embed = Database['public']['Tables']['embeds']['Row'];
type AvailabilitySlot = { day_of_week: number; start_time: string; end_time: string };

export function useEmbedData(id: string | null) {
  const [embed, setEmbed] = React.useState<Embed | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [availability, setAvailability] = React.useState<AvailabilitySlot[]>([]);
  const [availabilityData, setAvailabilityData] = React.useState<AvailabilityStatus[]>([]);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createBrowserSupabaseClient();
        
        // Fetch embed data
        const { data: embedData, error: embedError } = await supabase
          .from('embeds')
          .select('*')
          .eq('id', id)
          .single();

        if (embedError) throw embedError;
        setEmbed(embedData);

        // Fetch availability data
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('availability')
          .select('*')
          .eq('embed_id', id);

        if (availabilityError) throw availabilityError;
        setAvailability(availabilityData);

        // Fetch monthly availability using current date
        const currentDate = DateTime.now().toISODate();
        const monthlyAvailability = await getAvailabilityForMonth(id, currentDate);
        setAvailabilityData(monthlyAvailability);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { 
    embed, 
    loading, 
    error, 
    availability,
    availabilityData 
  };
} 