'use server';

import { createClient } from '@/lib/supabase/server';
import { DateTime } from 'luxon';
import { cache } from 'react';
import { Database } from '@/types/database.types';

type Booking = Pick<Database['public']['Tables']['bookings']['Row'], 'date' | 'start_time' | 'end_time'>;

export type AvailabilityStatus = {
  date: string;
  hasAvailability: boolean;
  availableSlots: number;
};

export type TimeSlot = {
  time: string;
  isAvailable: boolean;
};

// Cache the availability data for 5 minutes
export const getAvailabilityForMonth = cache(async (embedId: string, monthIso: string): Promise<AvailabilityStatus[]> => {
  const supabase = await createClient();
  const month = DateTime.fromISO(monthIso);

  const startOfMonth = month.startOf('month').toISO();
  const endOfMonth = month.endOf('month').toISO();

  // Get all bookings for the month
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('date, start_time, end_time')
    .eq('embed_id', embedId)
    .gte('date', startOfMonth)
    .lte('date', endOfMonth);

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    throw new Error('Failed to fetch bookings');
  }

  // Get availability settings for the embed
  const { data: embed, error: embedError } = await supabase
    .from('embeds')
    .select('settings')
    .eq('id', embedId)
    .single();

  if (embedError) {
    console.error('Error fetching embed settings:', embedError);
    throw new Error('Failed to fetch embed settings');
  }

  const settings = embed.settings as { availability?: { slots: { day_of_week: number; start_time: string; end_time: string }[] } };
  const availabilitySlots = settings.availability?.slots || [];

  // Generate all dates for the month
  const dates: AvailabilityStatus[] = [];
  let currentDate = month.startOf('month');

  while (currentDate <= month.endOf('month')) {
    const dateStr = currentDate.toISODate()!;
    const dayOfWeek = currentDate.weekday % 7;
    const isPast = currentDate < DateTime.now().startOf('day');

    // Get all availability slots for this weekday
    const slotsForDay = availabilitySlots.filter(slot => slot.day_of_week === dayOfWeek);

    // Generate all time slot start times for the day
    const allSlotTimes = slotsForDay.flatMap(slot => {
      const slotTimes = [];
      let start = DateTime.fromFormat(slot.start_time, 'HH:mm:ss');
      const end = DateTime.fromFormat(slot.end_time, 'HH:mm:ss');

      while (start < end) {
        slotTimes.push(start.toFormat('HH:mm:ss'));
        start = start.plus({ minutes: 30 }); // assumes 30 min slot
      }

      return slotTimes;
    });

    // Count how many are not already booked
    const dayBookings = (bookings as Booking[]).filter(booking => booking.date === dateStr);
    const bookedTimes = new Set(dayBookings.map(b => b.start_time));
    const availableTimeCount = allSlotTimes.filter(time => !bookedTimes.has(time)).length;

    dates.push({
      date: dateStr,
      hasAvailability: !isPast && availableTimeCount > 0,
      availableSlots: availableTimeCount
    });

    currentDate = currentDate.plus({ days: 1 });
  }

  return dates;
});

export const getAvailableTimeSlots = cache(async (embedId: string, date: string): Promise<TimeSlot[]> => {
  const supabase = await createClient();

  // Get availability settings for the embed
  const { data: embed, error: embedError } = await supabase
    .from('embeds')
    .select('settings')
    .eq('id', embedId)
    .single();

  if (embedError) {
    console.error('Error fetching embed settings:', embedError);
    throw new Error('Failed to fetch embed settings');
  }

  const settings = embed.settings as { availability?: { slots: { day_of_week: number; start_time: string; end_time: string }[] } };
  const availabilitySlots = settings.availability?.slots || [];

  // Get bookings for the specific date
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('embed_id', embedId)
    .eq('date', date);

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    throw new Error('Failed to fetch bookings');
  }

  const dateObj = DateTime.fromISO(date);
  const dayOfWeek = dateObj.weekday % 7;
  const isPast = dateObj < DateTime.now().startOf('day');

  // Get available slots for this day of week
  const daySlots = availabilitySlots.filter(slot => slot.day_of_week === dayOfWeek);

  // Generate all possible time slots
  const timeSlots: TimeSlot[] = [];
  const now = DateTime.now();

  daySlots.forEach(slot => {
    let currentTime = DateTime.fromFormat(slot.start_time, 'HH:mm:ss');
    const endTime = DateTime.fromFormat(slot.end_time, 'HH:mm:ss');

    while (currentTime < endTime) {
      const timeStr = currentTime.toFormat('HH:mm:ss');
      const isPastTime = isPast || (dateObj.hasSame(now, 'day') && currentTime < now);
      const isBooked = (bookings as Pick<Booking, 'start_time'>[]).some(booking => booking.start_time === timeStr);

      timeSlots.push({
        time: timeStr,
        isAvailable: !isPastTime && !isBooked
      });

      currentTime = currentTime.plus({ minutes: 30 }); // Assuming 30-minute slots
    }
  });

  return timeSlots;
});

export const checkBookingAvailability = async (
  embedId: string,
  date: string,
  time: string
): Promise<{ available: boolean; message?: string }> => {
  const supabase = await createClient();

  // Check if the slot is already booked
  const { data: existingBooking, error: bookingError } = await supabase
    .from('bookings')
    .select('id')
    .eq('embed_id', embedId)
    .eq('date', date)
    .eq('start_time', time)
    .single();

  if (bookingError && bookingError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking booking availability:', bookingError);
    throw new Error('Failed to check booking availability');
  }

  if (existingBooking) {
    return {
      available: false,
      message: 'This time slot is already booked'
    };
  }

  // Check if the time is within available hours
  const { data: embed, error: embedError } = await supabase
    .from('embeds')
    .select('settings')
    .eq('id', embedId)
    .single();

  if (embedError) {
    console.error('Error fetching embed settings:', embedError);
    throw new Error('Failed to fetch embed settings');
  }

  const settings = embed.settings as { availability?: { slots: { day_of_week: number; start_time: string; end_time: string }[] } };
  const availabilitySlots = settings.availability?.slots || [];

  const dateObj = DateTime.fromISO(date);
  const dayOfWeek = dateObj.weekday % 7;
  const timeObj = DateTime.fromFormat(time, 'HH:mm:ss');

  const isWithinAvailableHours = availabilitySlots.some(slot => {
    if (slot.day_of_week !== dayOfWeek) return false;
    const slotStart = DateTime.fromFormat(slot.start_time, 'HH:mm:ss');
    const slotEnd = DateTime.fromFormat(slot.end_time, 'HH:mm:ss');
    return timeObj >= slotStart && timeObj < slotEnd;
  });

  if (!isWithinAvailableHours) {
    return {
      available: false,
      message: 'This time is not within available hours'
    };
  }

  return { available: true };
}; 