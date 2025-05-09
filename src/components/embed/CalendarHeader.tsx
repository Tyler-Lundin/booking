import { DateTime } from 'luxon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: DateTime;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={onPrevMonth}
        className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 transform hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
      <div className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {currentMonth.toFormat('MMMM yyyy')}
      </div>
      <button
        onClick={onNextMonth}
        className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300 transform hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
} 