import { DateTime } from 'luxon';
import { Clock } from 'lucide-react';

interface TimeSlotsProps {
  selectedDate: string;
  selectedTime: string;
  availableTimes: string[];
  error?: string;
  isLoading: boolean;
  isValidating: boolean;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlots({ 
  selectedDate, 
  selectedTime, 
  availableTimes,
  error,
  isLoading,
  isValidating,
  onTimeSelect 
}: TimeSlotsProps) {
  if (!selectedDate) {
    return (
      <div className="text-center py-8 px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50">
        <Clock className="w-8 h-8 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
        <p className="text-gray-500 dark:text-gray-400">Please select a date to see available times</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl w-1/3 mx-auto"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200/50 dark:border-red-800/50">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  const now = DateTime.now();
  const selectedDateTime = DateTime.fromISO(selectedDate);
  const isToday = selectedDateTime.hasSame(now, 'day');

  return (
    <div className="grid grid-cols-3 gap-3">
      {availableTimes.map((time) => {
        const isSelected = time === selectedTime;
        const isDisabled = isValidating && !isSelected;
        const timeObj = DateTime.fromFormat(time, 'HH:mm:ss');
        const isPastTime = isToday && timeObj < now;
        
        return (
          <button
            key={time}
            onClick={() => !isPastTime && onTimeSelect(time)}
            disabled={isDisabled || isPastTime}
            className={`
              relative p-3 rounded-xl text-center transition-all duration-300 transform hover:scale-105
              ${isSelected
                ? 'bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white shadow-lg'
                : isDisabled || isPastTime
                ? 'bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200/50 dark:border-gray-700/50'
                : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/20 dark:hover:border-orange-500/20'
              }
            `}
          >
            <span className="relative z-10">
              {isValidating && isSelected ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                DateTime.fromFormat(time, 'HH:mm:ss').toFormat('h:mm a')
              )}
            </span>
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-pink-500 dark:to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            )}
          </button>
        );
      })}
    </div>
  );
} 