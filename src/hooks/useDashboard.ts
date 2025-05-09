'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from './useSupbaseAuth';
import { Embed } from '@/types/custom.types';
import { getAvailabilityForMonth, AvailabilityStatus } from '@/app/actions/availability';
import { DateTime } from 'luxon';


export function useDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError, supabase } = useSupabaseAuth();
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [loadingEmbeds, setLoadingEmbeds] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'projects' | 'bookings' | 'appointments' | 'availability'>('projects');
  const [availabilityData, setAvailabilityData] = useState<Record<string, AvailabilityStatus[]>>({});

  useEffect(() => {
    if (authError) router.push('/auth');
  }, [authError, router]);

  useEffect(() => {
    const fetchEmbeds = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .or(`owner_id.eq.${user.id},admin_ids.cs.{${user.id}}`);

      if (error) {
        console.error(error);
        return;
      }

      if (!data || data.length === 0) {
        router.push('/embed/create');
        return;
      }

      setEmbeds(data);
      setLoadingEmbeds(false);

      // Fetch availability data for each embed
      const currentMonth = DateTime.now().toISO();
      const availabilityPromises = data.map(async (embed) => {
        try {
          const availability = await getAvailabilityForMonth(embed.id, currentMonth);
          return { [embed.id]: availability };
        } catch (error) {
          console.error(`Error fetching availability for embed ${embed.id}:`, error);
          return { [embed.id]: [] };
        }
      });

      const availabilityResults = await Promise.all(availabilityPromises);
      const combinedAvailability = availabilityResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setAvailabilityData(combinedAvailability);
    };

    fetchEmbeds();
  }, [user, supabase, router]);

  const filteredAndSortedEmbeds = useMemo(() => {
    return embeds
      .filter(embed => 
        embed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        embed.settings.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' 
            ? (a.settings.company_name || a.name).localeCompare(b.settings.company_name || b.name)
            : (b.settings.company_name || b.name).localeCompare(a.settings.company_name || a.name);
        } else {
          return sortOrder === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [embeds, searchQuery, sortBy, sortOrder]);

  const copyEmbedCode = (embedId: string) => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${embedId}/iframe" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
  };

  return {
    user,
    loading: authLoading || loadingEmbeds,
    error: authError,
    embeds: filteredAndSortedEmbeds,
    availabilityData,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    activeTab,
    setActiveTab,
    copyEmbedCode,
    router
  };
} 