import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Embed } from "@/types/booking.types";

export function useCreateEmbed() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [newEmbed, setNewEmbed] = useState<Embed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 15000); // Clear error after 15 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  const createEmbed = async (embed: Embed) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('embeds').insert(embed).select().single();
      if (error) throw error;
      setNewEmbed(data);
      router.push(`/embed/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create embed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmbed = async (embed: Embed) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('embeds').update(embed).eq('id', embed.id).select().single();
      if (error) throw error;
      setNewEmbed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update embed');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmbed = async (embed: Embed) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('embeds').delete().eq('id', embed.id);
      if (error) throw error;
      setNewEmbed(null);
      router.push('/embeds');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete embed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newEmbed,
    setNewEmbed,
    createEmbed,
    updateEmbed,
    deleteEmbed,
    isLoading,
    error,
  };
} 