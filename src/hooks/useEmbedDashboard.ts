import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { encryptFields, decryptFields } from '@/app/actions/encryption';

type Embed = Database['public']['Tables']['embeds']['Row'] & {
  settings: {
    supabase_url?: string;
    supabase_anon_key?: string;
    supabase_service_role_key?: string;
    company_name?: string;
    industry?: 'barbershop' | 'tattoo' | 'optometry' | 'dental' | 'custom';
    timezone?: string;
    theme?: 'light' | 'dark' | 'system';
    min_booking_notice_hours?: number;
    max_attendees?: number;
    archive_after_days?: number;
    allowed_booking_types?: string[];
    secure_booking?: boolean;
    [key: string]: unknown;
  };
};

type BookingType = Database['public']['Tables']['booking_types']['Row'];

interface UseEmbedDashboardProps {
  embedId: string;
}

interface UseEmbedDashboardReturn {
  embed: Embed | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  formData: Partial<Embed>;
  isSubmitting: boolean;
  hasChanges: boolean;
  bookingTypes: BookingType[];
  isBookingTypesLoading: boolean;
  setIsEditing: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  handleDelete: () => Promise<void>;
  createBookingType: (data: Omit<BookingType, 'id' | 'created_at' | 'updated_at' | 'embed_id'>) => Promise<void>;
  updateBookingType: (id: string, data: Partial<BookingType>) => Promise<void>;
  deleteBookingType: (id: string) => Promise<void>;
}

const ENCRYPTED_FIELDS = [
  'settings.supabase_url',
  'settings.supabase_anon_key',
  'settings.supabase_service_role_key'
] as const;


export function useEmbedDashboard({ embedId }: UseEmbedDashboardProps): UseEmbedDashboardReturn {
  const [embed, setEmbed] = useState<Embed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Embed>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>([]);
  const [isBookingTypesLoading, setIsBookingTypesLoading] = useState(false);

  const router = useRouter();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchEmbed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('embeds')
        .select('*')
        .eq('id', embedId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw new Error('Embed not found');
      }

      // Check if user has permission to access this embed
      if (data.owner_id !== user.id && !data.admin_ids.includes(user.id)) {
        throw new Error('Unauthorized');
      }

      // Decrypt sensitive fields
      const decryptedData = await decryptFields(data, ENCRYPTED_FIELDS as unknown as Array<keyof Embed>);
      setEmbed(decryptedData as unknown as Embed);
      setFormData(decryptedData as unknown as Partial<Embed>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [embedId, supabase]);

  const fetchBookingTypes = useCallback(async () => {
    try {
      setIsBookingTypesLoading(true);
      const { data, error } = await supabase
        .from('booking_types')
        .select('*')
        .eq('embed_id', embedId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBookingTypes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking types');
    } finally {
      setIsBookingTypesLoading(false);
    }
  }, [embedId, supabase]);

  useEffect(() => {
    fetchEmbed();
    fetchBookingTypes();
  }, [fetchEmbed, fetchBookingTypes]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...(typeof prev.settings === 'object' && prev.settings ? prev.settings : {}),
          [settingName]: value
        } as Embed['settings']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setHasChanges(true);
  }, []);

  const handleCheckboxChange = useCallback((name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    setHasChanges(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!embed) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Encrypt sensitive fields before saving
      const encryptedData = await encryptFields(formData, ENCRYPTED_FIELDS as unknown as Array<keyof typeof formData>);

      const { error: updateError } = await supabase
        .from('embeds')
        .update(encryptedData)
        .eq('id', embedId);

      if (updateError) {
        throw updateError;
      }

      await fetchEmbed();
      setIsEditing(false);
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update embed');
    } finally {
      setIsSubmitting(false);
    }
  }, [embed, embedId, formData, fetchEmbed, supabase]);

  const handleCancel = useCallback(() => {
    setFormData(embed || {});
    setIsEditing(false);
    setHasChanges(false);
  }, [embed]);

  const handleDelete = useCallback(async () => {
    if (!embed) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('embeds')
        .delete()
        .eq('id', embedId);

      if (deleteError) {
        throw deleteError;
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete embed');
    } finally {
      setIsSubmitting(false);
    }
  }, [embed, embedId, router, supabase]);

  const createBookingType = useCallback(async (data: Omit<BookingType, 'id' | 'created_at' | 'updated_at' | 'embed_id'>) => {
    try {
      const { error } = await supabase
        .from('booking_types')
        .insert({
          ...data,
          embed_id: embedId
        });

      if (error) throw error;
      await fetchBookingTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking type');
      throw err;
    }
  }, [embedId, fetchBookingTypes, supabase]);

  const updateBookingType = useCallback(async (id: string, data: Partial<BookingType>) => {
    try {
      const { error } = await supabase
        .from('booking_types')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await fetchBookingTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking type');
      throw err;
    }
  }, [fetchBookingTypes, supabase]);

  const deleteBookingType = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('booking_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBookingTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking type');
      throw err;
    }
  }, [fetchBookingTypes, supabase]);

  return {
    embed,
    loading,
    error,
    isEditing,
    formData,
    isSubmitting,
    hasChanges,
    bookingTypes,
    isBookingTypesLoading,
    setIsEditing,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleCancel,
    handleDelete,
    createBookingType,
    updateBookingType,
    deleteBookingType
  };
} 