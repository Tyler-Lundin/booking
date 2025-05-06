'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DateTime } from 'luxon';
import { Database } from '@/types/database.types';

export type AvailabilitySlot = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  buffer_minutes: number | null;
  embed_id: string;
  is_recurring: boolean | null;
  start_date: string | null;
  end_date: string | null;
};

export async function validateBookingSlot(
  embedId: string,
  selectedDate: string,
  selectedTime: string
): Promise<{
  isValid: boolean;
  slot?: AvailabilitySlot;
  error?: string;
}> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Validate date is not in the past
    const dateObj = DateTime.fromISO(selectedDate);
    const today = DateTime.now().startOf('day');
    if (dateObj < today) {
      return {
        isValid: false,
        error: 'Cannot book appointments in the past',
      };
    }

    // Get availability slots for the selected date
    const { data: slots, error } = await supabase
      .from('availability')
      .select('*')
      .eq('embed_id', embedId)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;

    // Find matching slot for the selected date and time
    const dayOfWeek = dateObj.weekday % 7;
    const selectedDateTime = DateTime.fromFormat(selectedTime, 'HH:mm:ss');
    
    const matchingSlot = slots?.find(slot => {
      if (slot.day_of_week !== dayOfWeek) return false;
      
      const slotStart = DateTime.fromFormat(slot.start_time, 'HH:mm:ss');
      const slotEnd = DateTime.fromFormat(slot.end_time, 'HH:mm:ss');
      
      return selectedDateTime >= slotStart && selectedDateTime < slotEnd;
    });

    if (!matchingSlot) {
      return {
        isValid: false,
        error: 'Selected time slot is not available',
      };
    }

    // Ensure the slot matches our type
    const validSlot: AvailabilitySlot = {
      id: matchingSlot.id,
      day_of_week: matchingSlot.day_of_week || 0,
      start_time: matchingSlot.start_time,
      end_time: matchingSlot.end_time,
      buffer_minutes: matchingSlot.buffer_minutes,
      embed_id: matchingSlot.embed_id,
      is_recurring: matchingSlot.is_recurring,
      start_date: matchingSlot.start_date,
      end_date: matchingSlot.end_date,
    };

    return {
      isValid: true,
      slot: validSlot,
    };
  } catch (error) {
    console.error('Error validating booking slot:', error);
    return {
      isValid: false,
      error: 'An error occurred while validating the booking slot',
    };
  }
}

export async function getAvailableTimeSlots(
  embedId: string,
  selectedDate: string
): Promise<{
  slots: string[];
  error?: string;
}> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const dateObj = DateTime.fromISO(selectedDate);
    const dayOfWeek = dateObj.weekday % 7;

    const { data: slots, error } = await supabase
      .from('availability')
      .select('*')
      .eq('embed_id', embedId)
      .eq('day_of_week', dayOfWeek)
      .order('start_time');

    if (error) throw error;

    const availableTimes = slots
      ?.flatMap(slot => {
        const [startHours, startMinutes] = slot.start_time.split(':').map(Number);
        const [endHours, endMinutes] = slot.end_time.split(':').map(Number);
        const startTime = startHours * 60 + startMinutes;
        const endTime = endHours * 60 + endMinutes;
        
        const times = [];
        for (let time = startTime; time < endTime; time += 30) {
          const hours = Math.floor(time / 60);
          const minutes = time % 60;
          times.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
        }
        return times;
      })
      .filter((time, index, self) => self.indexOf(time) === index)
      .sort() || [];

    return {
      slots: availableTimes,
    };
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return {
      slots: [],
      error: 'An error occurred while fetching available time slots',
    };
  }
} 