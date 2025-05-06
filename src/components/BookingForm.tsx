// components/BookingForm.tsx

'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import Cookies from 'js-cookie';
import useBookingForm from '@/hooks/useBookingForm';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

interface BookingFormProps {
  selectedDate: string;
  selectedTime: string;
  embedId: string;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  buffer_minutes: number | null;
  embed_id: string;
  is_recurring: boolean | null;
  start_date: string | null;
  end_date: string | null;
}

export default function BookingForm({ selectedDate, selectedTime, embedId }: BookingFormProps) {
  console.log('BookingForm Props:', { selectedDate, selectedTime, embedId });
  
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    formData,
    setFormData,
    user,
    handleInputChange,
    handleSubmit,
    handleConfirmBooking,
    isSubmitting,
    error,
    success,
    showConfirmation,
    setShowConfirmation,
    hasRecentBooking,
    createAccount,
    setCreateAccount,
    setSelectedDate,
    setSelectedTime,
    setEmbedId,
  } = useBookingForm();

  useEffect(() => {
    setSelectedDate(selectedDate);
    setSelectedTime(selectedTime);
    setEmbedId(embedId);
    fetchAvailability();
  }, [selectedDate, selectedTime, embedId]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('embed_id', embedId)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setAvailability(data || []);
      
      // Find the slot that matches the selected time
      const date = DateTime.fromISO(selectedDate);
      const dayOfWeek = date.weekday % 7; // Convert to 0-6 range
      const selectedDateTime = DateTime.fromFormat(selectedTime, 'HH:mm:ss');
      
      console.log('Validating time slot:', {
        selectedDate,
        selectedTime,
        dayOfWeek,
        selectedDateTime: selectedDateTime.toFormat('HH:mm:ss')
      });
      
      const matchingSlot = data?.find(slot => {
        if (slot.day_of_week !== dayOfWeek) return false;
        
        const slotStart = DateTime.fromFormat(slot.start_time, 'HH:mm:ss');
        const slotEnd = DateTime.fromFormat(slot.end_time, 'HH:mm:ss');
        
        console.log('Checking slot:', {
          slotStart: slotStart.toFormat('HH:mm:ss'),
          slotEnd: slotEnd.toFormat('HH:mm:ss'),
          selectedTime: selectedDateTime.toFormat('HH:mm:ss'),
          isWithinRange: selectedDateTime >= slotStart && selectedDateTime < slotEnd
        });
        
        return selectedDateTime >= slotStart && selectedDateTime < slotEnd;
      });
      
      setSelectedSlot(matchingSlot || null);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED);
  const formattedTime = DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a');

  const isTimeSlotAvailable = (time: string) => {
    if (!availability.length) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const selectedTime = hours * 60 + minutes;
    
    return availability.some(slot => {
      const [startHours, startMinutes] = slot.start_time.split(':').map(Number);
      const [endHours, endMinutes] = slot.end_time.split(':').map(Number);
      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;
      
      return selectedTime >= startTime && selectedTime <= endTime;
    });
  };

  const isDayAvailable = (date: Date) => {
    if (!availability.length) return false;
    
    const dayOfWeek = date.getDay();
    return availability.some(slot => slot.day_of_week === dayOfWeek);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!selectedSlot) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold">Invalid Time Slot</h3>
        <p className="text-gray-600">
          The selected time is not available for booking. Please select a different time.
        </p>
        <div className="text-sm text-gray-500">
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
        </div>
      </div>
    );
  }

  if (hasRecentBooking) {
    return (
      <div className="text-center space-y-4">
        <div className="text-indigo-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-semibold">Booking Completed</h3>
        <p className="text-gray-600">
          Thank you for your booking! You can create another booking after 24 hours.
        </p>
        <div className="text-sm text-gray-500">
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
        </div>
        <div className="pt-4">
          <a
            href={`/bookings/${Cookies.get('booking_completed')}`}
            className="text-indigo-600 hover:text-indigo-700"
          >
            View Booking Details
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
        <p className="text-gray-600">
          Your booking has been created successfully. Redirecting to booking details...
        </p>
        <div className="text-sm text-gray-500">
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>
      
      {loading ? (
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => {
                const date = new Date(e.target.value);
                if (isDayAvailable(date)) {
                  setFormData({ ...formData, date: e.target.value });
                }
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <select
              id="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a time</option>
              {Array.from({ length: 24 * 2 }, (_, i) => {
                const hours = Math.floor(i / 2);
                const minutes = (i % 2) * 30;
                const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                const isAvailable = isTimeSlotAvailable(time);
                
                return (
                  <option 
                    key={time} 
                    value={time}
                    disabled={!isAvailable}
                    className={!isAvailable ? 'text-gray-400' : ''}
                  >
                    {time} {!isAvailable ? '(Unavailable)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {['name', 'email', 'phone'].map(field => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field} *
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                id={field}
                name={field}
                value={formData[field as keyof typeof formData] as string}
                onChange={handleInputChange}
                required={field !== 'email' || !user}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder={`Your ${field}`}
              />
            </div>
          ))}

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Tell us about your appointment..."
            />
          </div>

          {!user && (
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="createAccount"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Create an account to manage your bookings</span>
              </label>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Booking...' : 'Review Booking'}
          </button>

          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Date:</strong> {formattedDate}</li>
                  <li><strong>Time:</strong> {formattedTime}</li>
                  {selectedSlot.buffer_minutes && selectedSlot.buffer_minutes > 0 && (
                    <li><strong>Buffer Time:</strong> {selectedSlot.buffer_minutes} minutes</li>
                  )}
                  <li><strong>Name:</strong> {formData.name}</li>
                  {formData.email && <li><strong>Email:</strong> {formData.email}</li>}
                  {formData.phone && <li><strong>Phone:</strong> {formData.phone}</li>}
                  {formData.message && <li><strong>Message:</strong> {formData.message}</li>}
                </ul>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
