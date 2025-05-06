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