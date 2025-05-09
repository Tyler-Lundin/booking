'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

interface BaseBookingFormProps {
  selectedDate: string;
  selectedTime: string;
  embedId: string;
  industry: Database['public']['Enums']['industry_type'];
}

export default function BaseBookingForm({ 
  selectedDate, 
  selectedTime, 
  embedId,
}: BaseBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Base validation logic here
      const { error: validationError } = await supabase.rpc('validate_booking', {
        p_embed_id: embedId,
        p_date: selectedDate,
        p_time: selectedTime
      });

      if (validationError) throw validationError;

      // Industry-specific booking creation will be handled by child components
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
        <p className="text-gray-600">
          Your booking has been created successfully.
        </p>
        <div className="text-sm text-gray-500">
          <p>Date: {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED)}</p>
          <p>Time: {DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>Date: {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED)}</p>
          <p>Time: {DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a')}</p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Booking...' : 'Review Booking'}
        </button>
      </form>
    </div>
  );
} 