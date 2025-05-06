import { DateTime } from 'luxon';

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
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Please select a date first
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        <span className="ml-2 text-gray-500 dark:text-gray-400">Loading time slots...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (availableTimes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        No available time slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableTimes.map((time) => {
        const isSelected = time === selectedTime;
        const isDisabled = isValidating && !isSelected;
        
        return (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            disabled={isDisabled}
            className={`p-3 rounded-lg text-center ${
              isSelected
                ? 'bg-indigo-600 text-white'
                : isDisabled
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {isValidating && isSelected ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            ) : (
              DateTime.fromFormat(time, 'HH:mm:ss').toFormat('h:mm a')
            )}
          </button>
        );
      })}
    </div>
  );
} 