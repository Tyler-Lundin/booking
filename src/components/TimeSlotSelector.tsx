'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DateTime } from 'luxon'
import { formatTime } from '@/utils/time'

interface TimeSlotSelectorProps {
  selectedDate: string | null
  onTimeSelect: (time: string) => void
  selectedTime: string | null
  onBookingComplete?: () => void
  embedId: string
}

interface Availability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  buffer_minutes: number
}

interface Booking {
  id: string
  start_time: string
  status: string
}

interface EmbedSettings {
  id: string
  name: string
  client_id: string
  settings: {
    allowed_booking_types?: string[]
    max_attendees?: number
    min_booking_notice_hours?: number
    // Add more settings as needed
  }
}

export default function TimeSlotSelector({
  selectedDate,
  onTimeSelect,
  selectedTime,
  onBookingComplete,
  embedId,
}: TimeSlotSelectorProps) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [embedSettings, setEmbedSettings] = useState<EmbedSettings | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (embedId) {
      fetchEmbedSettings()
    }
  }, [embedId])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability()
      fetchBookings()
    }
  }, [selectedDate])

  // Add effect to refresh data when a booking is completed
  useEffect(() => {
    if (onBookingComplete) {
      fetchAvailability()
      fetchBookings()
    }
  }, [onBookingComplete])

  const fetchEmbedSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .eq('id', embedId)
        .single()

      if (error) throw error
      setEmbedSettings(data)
    } catch (err) {
      console.error('Failed to load embed settings:', err)
    }
  }

  const fetchAvailability = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) throw error
      setAvailability(data || [])
    } catch (err) {
      setError('Failed to load availability')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    if (!selectedDate) return

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, start_time, status')
        .eq('date', selectedDate)
        .in('status', ['pending', 'confirmed'])

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error('Failed to load bookings:', err)
    }
  }

  const getTimeSlots = () => {
    if (!selectedDate) return []
    
    const date = DateTime.fromISO(selectedDate)
    const dayOfWeek = date.weekday % 7 // Convert to 0-6 range
    const dayAvailability = availability.filter(a => a.day_of_week === dayOfWeek)
    
    if (dayAvailability.length === 0) return []

    // Apply embed-specific rules if they exist
    let filteredSlots = dayAvailability
    if (embedSettings?.settings) {
      const { min_booking_notice_hours } = embedSettings.settings
      if (min_booking_notice_hours) {
        const now = DateTime.now()
        const minNoticeTime = now.plus({ hours: min_booking_notice_hours })
        filteredSlots = filteredSlots.filter(slot => {
          const slotTime = DateTime.fromISO(`${selectedDate}T${slot.start_time}`)
          return slotTime >= minNoticeTime
        })
      }
    }

    // Return all time slots for the day
    return filteredSlots.map(slot => ({
      start: slot.start_time,
      end: slot.end_time,
      isBooked: bookings.some(booking => booking.start_time === slot.start_time)
    }))
  }

  const timeSlots = getTimeSlots()

  if (loading) {
    return <div className="text-center py-4">Loading available times...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (!selectedDate) {
    return <div className="text-center py-4 text-gray-500">Select a date to see available times</div>
  }

  if (timeSlots.length === 0) {
    return <div className="text-center py-4 text-gray-500">No available times for this date</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {timeSlots.map((slot) => {
        const startTime = formatTime(slot.start, DateTime.now().zoneName)
        const endTime = formatTime(slot.end, DateTime.now().zoneName)
        const isSelected = selectedTime === slot.start
        const isBooked = slot.isBooked
        
        return (
          <button
            key={slot.start}
            onClick={() => !isBooked && onTimeSelect(slot.start)}
            disabled={isBooked}
            className={`
              p-3 rounded-lg text-center
              ${isBooked 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : isSelected 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            {startTime} - {endTime}
            {isBooked && <span className="block text-xs mt-1">Booked</span>}
          </button>
        )
      })}
    </div>
  )
} 