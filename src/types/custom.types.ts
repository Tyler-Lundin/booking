import { Database } from './database.types';
import type { 
  BookingStatus, 
  AppointmentType, 
  AppointmentField, 
  Booking,
  CustomField,
  IndustrySettings,
  EmbedSettings,
  IndustryType
} from './booking.types';

export type Embed = Database['public']['Tables']['embeds']['Row'] & {
  settings: EmbedSettings;
};

export type { 
  BookingStatus, 
  AppointmentType, 
  AppointmentField, 
  Booking,
  CustomField,
  IndustrySettings,
  EmbedSettings,
  IndustryType
}; 


export type CreateBookingData = Database['public']['Tables']['bookings']['Insert'] & {
  metadata?: {
    budget?: string;
    timeline?: string;
    projectType?: string;
    preferredTechStack?: string;
    projectDescription?: string; 
    technicalRequirements?: string;
  };
}; 


export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  field_types: Record<string, string>;
  field_options: Record<string, string[]>;
}
