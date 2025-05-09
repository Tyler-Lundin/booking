// hooks/useBookingForm.ts

'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { DateTime } from 'luxon';
import Cookies from 'js-cookie';
import { BookingFormData } from '@/types/database.types';
import { getFingerprint } from '@/lib/fingerprint';
import { User } from '@supabase/supabase-js';

const BOOKING_COOKIE_KEY = 'booking_completed';
const BOOKING_COOKIE_EXPIRY = 1; // in days

export default function useBookingForm() {
  const supabase = createBrowserSupabaseClient();

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: '',
    field_types: {},
    field_options: {},
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [embedId, setEmbedId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasRecentBooking, setHasRecentBooking] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (Cookies.get(BOOKING_COOKIE_KEY)) setHasRecentBooking(true);

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, [supabase]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: BookingFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setError(null);
    setShowConfirmation(false);

    try {
      const fingerprint = user ? null : await getFingerprint();

      if (!user && fingerprint) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('fingerprint', fingerprint)
          .gte('created_at', DateTime.now().minus({ hours: 24 }).toISO());

        if (error) throw error;
        if (data?.length) throw new Error("You've already made a booking recently.");
      }

      const { data: availability, error: availabilityError } = await supabase
        .from('availability')
        .select('*')
        .eq('day_of_week', DateTime.fromISO(selectedDate).weekday % 7)
        .eq('start_time', selectedTime)
        .single();

      if (availabilityError || !availability) {
        throw new Error('Time slot is no longer available.');
      }

      const { data: conflicts, error: conflictsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', selectedDate)
        .eq('start_time', selectedTime);

      if (conflictsError) throw conflictsError;
      if (conflicts?.length) throw new Error('This time slot is already booked.');

      const endTime = DateTime.fromFormat(selectedTime, 'HH:mm:ss')
        .plus({ minutes: 30 })
        .toFormat('HH:mm:ss');

      const payload = {
        date: selectedDate,
        start_time: selectedTime,
        end_time: endTime,
        status: 'pending',
        notes: formData.message,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        embed_id: embedId,
        ...(user && { user_id: user.id }),
        ...(fingerprint && { fingerprint }),
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(payload)
        .select('id')
        .single();

      if (bookingError) throw bookingError;

      Cookies.set(BOOKING_COOKIE_KEY, booking.id, { expires: BOOKING_COOKIE_EXPIRY });
      setHasRecentBooking(true);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '', type: '', field_types: {}, field_options: {} });

      if (createAccount && !user) {
        const tempPassword = Math.random().toString(36).slice(-8);
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: tempPassword,
        });
        if (signUpError) console.error('Signup error:', signUpError);
      }

      setTimeout(() => {
        window.location.href = `/bookings/${booking.id}`;
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    formData,
    setFormData,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    embedId,
    setEmbedId,
    isSubmitting,
    error,
    success,
    showConfirmation,
    setShowConfirmation,
    hasRecentBooking,
    createAccount,
    setCreateAccount,
    handleInputChange,
    handleSubmit,
    handleConfirmBooking,
  };
}
