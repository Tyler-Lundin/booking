import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type Embed = Database['public']['Tables']['embeds']['Row'];
type AvailabilitySlot = { day_of_week: number; start_time: string; end_time: string };

export function useEmbedData(id: string) {
  const [embed, setEmbed] = useState<Embed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { embed, loading, error, availability };
} 