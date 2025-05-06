'use client';

import { DateTime } from 'luxon';
import { formatTime } from '@/utils/time';
import useTimeSlotSelector from '@/hooks/useTimeSlotSelector';

interface TimeSlotSelectorProps {
  selectedDate: string | null;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
  onBookingComplete?: boolean;
  embedId: string;
}

export default function TimeSlotSelector({
  selectedDate,
  onTimeSelect,
  selectedTime,
  onBookingComplete = false,
  embedId,
}: TimeSlotSelectorProps) {
  const {
    timeSlots,
    loading,
    error,
  } = useTimeSlotSelector({ embedId, selectedDate: selectedDate ?? '', onBookingComplete });

  if (!selectedDate) {
    return <div className="text-center py-6 text-gray-500">Select a date to see available times.</div>;
  }

  if (loading) {
    return <div className="text-center py-6 text-indigo-500 animate-pulse">Loading available times...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Available Time Slots</h2>
        <p className="text-gray-600 dark:text-gray-400">Select a time for your appointment</p>
      </div>

      {timeSlots.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No available time slots for this date</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {timeSlots.map((slot) => {
            const startTime = formatTime(slot.start, DateTime.now().zoneName);
            const endTime = formatTime(slot.end, DateTime.now().zoneName);
            const isSelected = selectedTime === slot.start;

            return (
              <button
                key={slot.start}
                onClick={() => !slot.isBooked && onTimeSelect(slot.start)}
                disabled={slot.isBooked}
                className={`
                  relative p-4 rounded-xl text-sm transition-all duration-200 border-2
                  ${slot.isBooked
                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-indigo-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700'}
                `}
              >
                <div className="font-medium">{startTime}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">to {endTime}</div>
                {slot.isBooked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Booked</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
