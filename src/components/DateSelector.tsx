'use client'

import { useState } from 'react'
import { DateTime } from 'luxon'
import useAvailableDates from '@/hooks/useAvailableDates'

interface DateSelectorProps {
  onDateSelect: (date: string) => void
  selectedDate: string | null
  embedId: string
}

export default function DateSelector({ onDateSelect, selectedDate, embedId }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(DateTime.now())
  const { isDateAvailable, loading, error } = useAvailableDates(embedId)
  
  // Generate dates for the current month view
  const startOfMonth = currentMonth.startOf('month')
  const endOfMonth = currentMonth.endOf('month')
  const daysInMonth = endOfMonth.diff(startOfMonth, 'days').days
  
  const dates = Array.from({ length: daysInMonth + 1 }, (_, i) => {
    const date = startOfMonth.plus({ days: i })
    const isAvailable = isDateAvailable(date)
    return {
      date: date.toFormat('yyyy-MM-dd'),
      display: date.toFormat('d'),
      isToday: date.hasSame(DateTime.now(), 'day'),
      isPast: date < DateTime.now().startOf('day'),
      isSelected: selectedDate === date.toFormat('yyyy-MM-dd'),
      isAvailable
    }
  })

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) {
    return <div className="text-center py-6 text-indigo-500 animate-pulse">Loading calendar...</div>
  }

  if (error) {
    return <div className="text-center py-6 text-red-600 font-medium">{error}</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Select a Date</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose an available date for your appointment</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(currentMonth.minus({ months: 1 }))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {currentMonth.toFormat('MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(currentMonth.plus({ months: 1 }))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
          {dates.map(({ date, display, isToday, isPast, isSelected, isAvailable }) => (
            <button
              key={date}
              onClick={() => !isPast && isAvailable && onDateSelect(date)}
              disabled={isPast || !isAvailable}
              className={`
                p-2 rounded-lg text-center transition-all duration-200
                ${isPast || !isAvailable 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${isToday ? 'border-2 border-indigo-500' : ''}
                ${isSelected ? 'bg-indigo-500 text-white hover:bg-indigo-600' : ''}
                ${!isAvailable ? 'bg-gray-100 dark:bg-gray-700' : ''}
              `}
            >
              {display}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 