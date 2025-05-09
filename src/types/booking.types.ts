import { Database } from '@/types/database.types';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type IndustryType = 
  | 'barbershop' 
  | 'tattoo' 
  | 'optometry' 
  | 'dental' 
  | 'landscaping'
  | 'nail-salon'
  | 'massage'
  | 'photography'
  | 'fitness'
  | 'auto-repair'
  | 'pet-care'
  | 'custom';

export type Embed = Omit<Database['public']['Tables']['embeds']['Row'], 'settings'> & {
  settings: EmbedSettings;
};

export type CustomField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
  placeholder?: string;
};

export type IndustrySettings = {
  id: IndustryType;
  name: string;
  description: string;
  defaultSettings: Partial<EmbedSettings>;
  availableBookingTypes: string[];
  customFields?: CustomField[];
};

export type EmbedSettings = {
  supabase_url?: string;
  supabase_anon_key?: string;
  supabase_service_role_key?: string;
  company_name?: string;
  industry?: IndustryType;
  timezone?: string;
  theme?: 'light' | 'dark' | 'system';
  min_booking_notice_hours?: number;
  max_attendees?: number;
  archive_after_days?: number;
  allowed_booking_types?: string[];
  secure_booking?: boolean;
  custom_fields?: Record<string, unknown>;
  [key: string]: unknown;
};

export type AppointmentType = {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price?: number;
  color?: string;
  fields?: AppointmentField[];
  industry_specific?: boolean;
};

export type AppointmentField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
  placeholder?: string;
  industry_specific?: boolean;
};

export type Booking = {
  id: string;
  embed_id: string;
  appointment_type_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  notes?: string;
  custom_fields?: Record<string, string>;
  created_at: string;
  updated_at: string;
}; 