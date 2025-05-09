import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';

type AvailabilitySlot = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

interface CalendarGridProps {
  allDates: string[];
  currentMonth: DateTime;
  selectedDate: string;
  availability: AvailabilitySlot[];
  onDateSelect: (date: string) => void;
  minNoticeHours?: number;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({
  allDates,
  currentMonth,
  selectedDate,
  availability,
  onDateSelect,
  minNoticeHours = 24
}: CalendarGridProps) {
  const now = DateTime.now();
  const minNoticeTime = now.plus({ hours: minNoticeHours });

  const isDateAvailable = (date: string) => {
    const dateObj = DateTime.fromISO(date);
    const dayOfWeek = dateObj.weekday % 7;
    
    // Check if date is in the past or before minimum notice period
    if (dateObj <= minNoticeTime.startOf('day')) {
      return false;
    }

    // Check if there's availability for this day of week
    return availability.some(slot => slot.day_of_week === dayOfWeek);
  };

  return (
    <div className="space-y-2">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2">
        {DAY_LABELS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {allDates.map((date) => {
          const dateObj = DateTime.fromISO(date);
          const isAvailable = isDateAvailable(date);
          const isCurrentMonth = dateObj.month === currentMonth.month;
          const isSelected = date === selectedDate;
          const isToday = dateObj.hasSame(now, 'day');

          return (
            <button
              key={date}
              onClick={() => isAvailable && onDateSelect(date)}
              disabled={!isAvailable}
              className={cn(
                'relative p-2 text-center rounded-xl transition-all duration-300 transform hover:scale-105 overflow-hidden',
                !isCurrentMonth && 'text-gray-300 dark:text-gray-600',
                !isAvailable && !isToday && 'border border-red-500',
                isAvailable && !isSelected && 'border border-green-500 hover:scale-110',
                isSelected && 'relative group bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-orange-500/20'
              )}
            >
              <span className={cn(
                'relative z-10',
                isToday && 'text-blue-500 tracking-tightest dark:text-orange-500 font-thin text-xs',
                isSelected && 'text-white'
              )}>{ isToday ? 'today' : dateObj.toFormat('d')}</span>
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-pink-500 dark:to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 