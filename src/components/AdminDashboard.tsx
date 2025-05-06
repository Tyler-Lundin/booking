'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { formatDate, formatTime } from '@/utils/time'
import { DateTime } from 'luxon'

interface Booking {
  id: string
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  notes: string | null
}

interface AvailabilitySlot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  buffer_minutes: number
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createBrowserSupabaseClient()
      
      const [bookingsResponse, availabilityResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select('*')
          .order('date', { ascending: true }),
        supabase
          .from('availability')
          .select('*')
      ])

      if (bookingsResponse.error) throw bookingsResponse.error
      if (availabilityResponse.error) throw availabilityResponse.error

      setBookings(bookingsResponse.data)
      setAvailability(availabilityResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(booking.date, DateTime.now().zoneName)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(booking.start_time, DateTime.now().zoneName)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Availability Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availability.map((slot) => (
            <div
              key={slot.id}
              className="p-4 border rounded-lg dark:border-gray-700"
            >
              <h3 className="font-medium">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][slot.day_of_week]}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatTime(slot.start_time, DateTime.now().zoneName)} - {formatTime(slot.end_time, DateTime.now().zoneName)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Buffer: {slot.buffer_minutes} minutes
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 