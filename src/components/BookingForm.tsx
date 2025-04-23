'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DateTime } from 'luxon'
import { useAuth } from '@/contexts/AuthContext'
import Cookies from 'js-cookie'
import SocialLogin from './SocialLogin'
import { getFingerprint } from '@/lib/fingerprint'

interface BookingFormProps {
  selectedDate: string
  selectedTime: string
  onBookingComplete: () => void
  embedId: string
}

interface BookingFormData {
  name: string
  email: string
  phone: string
  message: string
}

const BOOKING_COOKIE_KEY = 'booking_completed'
const BOOKING_COOKIE_EXPIRY = 24 // hours

export default function BookingForm({
  selectedDate,
  selectedTime,
  onBookingComplete,
  embedId,
}: BookingFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: user?.email || '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasRecentBooking, setHasRecentBooking] = useState(false)
  const [createAccount, setCreateAccount] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing booking cookie
    const bookingCookie = Cookies.get(BOOKING_COOKIE_KEY)
    if (bookingCookie) {
      setHasRecentBooking(true)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)
    setError(null)
    setShowConfirmation(false)

    try {
      // Get fingerprint for unauthenticated users
      const fingerprint = user ? null : await getFingerprint()

      // For unauthenticated users, check for recent bookings with the same fingerprint
      if (!user && fingerprint) {
        const { data: recentBookings, error: recentBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('fingerprint', fingerprint)
          .gte('created_at', DateTime.now().minus({ hours: 24 }).toISO())

        if (recentBookingsError) throw recentBookingsError
        if (recentBookings && recentBookings.length > 0) {
          throw new Error('You have already made a booking in the last 24 hours. Please wait before making another booking.')
        }
      }

      // Check if the slot is still available
      const { data: availability, error: availabilityError } = await supabase
        .from('availability')
        .select('*')
        .eq('day_of_week', DateTime.fromISO(selectedDate).weekday % 7)
        .eq('start_time', selectedTime)
        .single()

      if (availabilityError || !availability) {
        throw new Error('This time slot is no longer available')
      }

      // Check for existing bookings that might conflict
      const { data: existingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', selectedDate)
        .eq('start_time', selectedTime)

      if (bookingsError) throw bookingsError
      if (existingBookings && existingBookings.length > 0) {
        throw new Error('This time slot has already been booked')
      }

      const endTime = DateTime.fromFormat(selectedTime, 'HH:mm:ss')
        .plus({ minutes: 30 }) // Default 30-minute duration
        .toFormat('HH:mm:ss')

      // Create the booking
      const bookingData = {
        date: selectedDate,
        start_time: selectedTime,
        end_time: endTime,
        status: 'pending',
        notes: formData.message,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        embed_id: embedId,
        ...(user ? { user_id: user.id } : {}), // Only include user_id if user is authenticated
        ...(fingerprint ? { fingerprint } : {}), // Include fingerprint for unauthenticated users
      }

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          id,
          date,
          start_time,
          end_time,
          status,
          embed_id,
          user:users (
            email,
            full_name
          )
        `)
        .single()

      if (bookingError) throw bookingError

      // Set cookie with booking ID for 24 hours
      Cookies.set(BOOKING_COOKIE_KEY, booking.id, { expires: BOOKING_COOKIE_EXPIRY / 24 })
      setHasRecentBooking(true)

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
      
      // Call onBookingComplete to reset the parent state
      onBookingComplete()
      
      // After a short delay, redirect to the booking details page
      setTimeout(() => {
        window.location.href = `/bookings/${booking.id}`
      }, 2000)

      // If user wants to create an account and isn't already logged in
      if (createAccount && !user) {
        // Generate a random password
        const tempPassword = Math.random().toString(36).slice(-8)
        
        // Create the account
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: tempPassword,
        })

        if (signUpError) {
          console.error('Error creating account:', signUpError)
          // Continue with booking success even if account creation fails
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating your booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasRecentBooking) {
    return (
      <div className="text-center space-y-4">
        <div className="text-indigo-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-semibold">Booking Completed</h3>
        <p className="text-gray-600">
          Thank you for your booking! You can create another booking after {BOOKING_COOKIE_EXPIRY} hours.
        </p>
        <div className="text-sm text-gray-500">
          <p>Date: {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED)}</p>
          <p>Time: {DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a')}</p>
        </div>
        <div className="pt-4">
          <a
            href={`/bookings/${Cookies.get(BOOKING_COOKIE_KEY)}`}
            className="text-indigo-600 hover:text-indigo-700"
          >
            View Booking Details
          </a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
        <p className="text-gray-600">
          Your booking has been created successfully. Redirecting to booking details...
        </p>
        <div className="text-sm text-gray-500">
          <p>Date: {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED)}</p>
          <p>Time: {DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Breadcrumb section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">Selected Appointment:</span>
            <span className="text-gray-900">
              {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-900">
              {DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a')}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email {!user && '*'}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required={!user}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Tell us about your appointment..."
          />
        </div>

        {!user && (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="createAccount"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="createAccount" className="ml-2 block text-sm text-gray-700">
                Create an account to manage your bookings
              </label>
            </div>

            {createAccount && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Sign up with:</p>
                <SocialLogin />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Booking...' : 'Review Booking'}
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">
                  {DateTime.fromISO(selectedDate).toLocaleString(DateTime.DATE_MED)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium">
                  {DateTime.fromFormat(selectedTime, 'HH:mm:ss').toFormat('h:mm a')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{formData.name}</span>
              </div>
              {formData.email && (
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{formData.phone}</span>
                </div>
              )}
              {formData.message && (
                <div>
                  <span className="text-gray-600">Message:</span>
                  <p className="mt-1 text-sm text-gray-700">{formData.message}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 