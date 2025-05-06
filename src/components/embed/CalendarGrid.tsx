import { DateTime } from 'luxon';

type AvailabilitySlot = { day_of_week: number; start_time: string; end_time: string };

interface CalendarGridProps {
  allDates: string[];
  currentMonth: DateTime;
  selectedDate: string;
  availability: AvailabilitySlot[];
  onDateSelect: (date: string) => void;
}

export default function CalendarGrid({ 
  allDates, 
  currentMonth, 
  selectedDate, 
  availability, 
  onDateSelect 
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = DateTime.now().startOf('day');

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day) => (
        <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          {day}
        </div>
      ))}
      {allDates.map((date) => {
        const dateObj = DateTime.fromISO(date);
        const isSelected = date === selectedDate;
        const isCurrentMonth = dateObj.month === currentMonth.month;
        const jsDay = (dateObj.weekday - 1) % 7; // Convert 1-7 to 0-6
        const isAvailable = availability.some(s => s.day_of_week === (jsDay + 1) % 7);
        const isPastDate = dateObj < today;
        
        return (
          <button
            key={date}
            onClick={() => isAvailable && isCurrentMonth && !isPastDate && onDateSelect(date)}
            disabled={!isAvailable || !isCurrentMonth || isPastDate}
            className={`p-2 rounded-lg text-center ${
              isSelected
                ? 'bg-indigo-600 text-white'
                : isCurrentMonth
                ? isAvailable && !isPastDate
                  ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-transparent text-gray-300 dark:text-gray-600'
            }`}
          >
            <div className="text-lg font-bold">
              {dateObj.toFormat('d')}
            </div>
          </button>
        );
      })}
    </div>
  );
} 