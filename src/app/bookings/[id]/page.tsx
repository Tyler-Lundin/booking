'use client'

import { useEffect, useState, use } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { DateTime } from 'luxon'

interface Booking {
  id: string
  date: string
  start_time: string
  end_time: string
  status: string
  notes: string | null
  name: string
  email: string | null
  phone_number: string | null
  embed_id: string
  user_id: string | null
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function BookingDetailsPage({ params }: PageProps) {
  const { user } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const unwrappedParams = use(params)
  const bookingId = unwrappedParams.id

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single()

        if (error) throw error
        if (!data) {
          setError('Booking not found')
          return
        }

        // If the booking has a user_id and the current user doesn't match, show error
        if (data.user_id && user?.id !== data.user_id) {
          setError('You do not have permission to view this booking')
          return
        }

        setBooking(data)
      } catch (err) {
        setError('Failed to load booking details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [user, bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900">{error}</h3>
        </div>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Booking Confirmation
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your appointment has been scheduled
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {DateTime.fromFormat(booking.start_time, 'HH:mm:ss').toFormat('h:mm a')} -{' '}
                  {DateTime.fromFormat(booking.end_time, 'HH:mm:ss').toFormat('h:mm a')}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{booking.status}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{booking.name}</dd>
              </div>
              {booking.email && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.email}</dd>
                </div>
              )}
              {booking.phone_number && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.phone_number}</dd>
                </div>
              )}
              {booking.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{booking.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 