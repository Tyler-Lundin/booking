'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { useEmbedData } from '@/hooks/useEmbedData';
import { getAvailableTimeSlots, validateBookingSlot } from '@/app/actions/booking';
import BookingFormFactory from '@/components/booking/BookingFormFactory';
import CalendarHeader from '@/components/embed/CalendarHeader';
import CalendarGrid from '@/components/embed/CalendarGrid';
import TimeSlots from '@/components/embed/TimeSlots';

type AvailabilitySlot = { day_of_week: number; start_time: string; end_time: string };

interface EmbedIframeProps {
  id: string;
}

export default function EmbedIframe({ id }: EmbedIframeProps) {
  const { embed, loading, error, availability } = useEmbedData(id);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(DateTime.now());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [timeSlotsError, setTimeSlotsError] = useState<string>('');
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isValidatingTime, setIsValidatingTime] = useState(false);

  const firstDayOfMonth = currentMonth.startOf('month');
  const lastDayOfMonth = currentMonth.endOf('month');
  const firstDayOfWeek = firstDayOfMonth.minus({ days: firstDayOfMonth.weekday % 7 });
  const lastDayOfWeek = lastDayOfMonth.plus({ days: 6 - (lastDayOfMonth.weekday % 7) });

  const allDates = Array.from(
    { length: lastDayOfWeek.diff(firstDayOfWeek, 'days').days + 1 },
    (_, i) => firstDayOfWeek.plus({ days: i }).toISODate()
  );

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setIsLoadingTimeSlots(true);
    setTimeSlotsError('');
    
    try {
      const { slots, error } = await getAvailableTimeSlots(id, date);
      if (error) {
        setTimeSlotsError(error);
        setAvailableTimes([]);
      } else {
        setAvailableTimes(slots);
      }
    } catch (err) {
      setTimeSlotsError('Failed to load time slots');
      setAvailableTimes([]);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const handleTimeSelect = async (time: string) => {
    if (!selectedDate) return;
    
    setIsValidatingTime(true);
    try {
      const { isValid, error } = await validateBookingSlot(id, selectedDate, time);
      if (isValid) {
        setSelectedTime(time);
      } else {
        console.error('Invalid time slot:', error);
        setTimeSlotsError(error || 'Invalid time slot');
      }
    } catch (err) {
      setTimeSlotsError('Failed to validate time slot');
    } finally {
      setIsValidatingTime(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !embed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Error</h1>
          <p className="mt-2 text-gray-600 dark:text-white/80">
            {error || 'Embed not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {embed.name}
          </h1>
          <p className="text-gray-600 dark:text-white/80">
            Book your appointment below
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Date
              </h2>
              <CalendarHeader
                currentMonth={currentMonth}
                onPrevMonth={() => setCurrentMonth(prev => prev.minus({ months: 1 }))}
                onNextMonth={() => setCurrentMonth(prev => prev.plus({ months: 1 }))}
              />
              <CalendarGrid
                allDates={allDates}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                availability={availability}
                onDateSelect={handleDateSelect}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Time
              </h2>
              <TimeSlots
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableTimes={availableTimes}
                error={timeSlotsError}
                isLoading={isLoadingTimeSlots}
                isValidating={isValidatingTime}
                onTimeSelect={handleTimeSelect}
              />
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-8">
              <BookingFormFactory
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                embedId={id}
                industry={embed.industry}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 