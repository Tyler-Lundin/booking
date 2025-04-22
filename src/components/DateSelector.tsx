'use client'

import { useState } from 'react'
import { DateTime } from 'luxon'

interface DateSelectorProps {
  onDateSelect: (date: string) => void
  selectedDate: string | null
}

export default function DateSelector({ onDateSelect, selectedDate }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(DateTime.now())
  
  // Generate dates for the current month view
  const startOfMonth = currentMonth.startOf('month')
  const endOfMonth = currentMonth.endOf('month')
  const daysInMonth = endOfMonth.diff(startOfMonth, 'days').days
  
  const dates = Array.from({ length: daysInMonth + 1 }, (_, i) => {
    const date = startOfMonth.plus({ days: i })
    return {
      date: date.toFormat('yyyy-MM-dd'),
      display: date.toFormat('d'),
      isToday: date.hasSame(DateTime.now(), 'day'),
      isPast: date < DateTime.now().startOf('day'),
      isSelected: selectedDate === date.toFormat('yyyy-MM-dd')
    }
  })

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(currentMonth.minus({ months: 1 }))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ←
        </button>
        <h3 className="font-semibold">
          {currentMonth.toFormat('MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(currentMonth.plus({ months: 1 }))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {dates.map(({ date, display, isToday, isPast, isSelected }) => (
          <button
            key={date}
            onClick={() => !isPast && onDateSelect(date)}
            disabled={isPast}
            className={`
              p-2 rounded-lg text-center
              ${isPast ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              ${isToday ? 'border-2 border-indigo-500' : ''}
              ${isSelected ? 'bg-indigo-500 text-white hover:bg-indigo-600' : ''}
            `}
          >
            {display}
          </button>
        ))}
      </div>
    </div>
  )
} 