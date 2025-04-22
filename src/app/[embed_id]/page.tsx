'use client'

import { useState, use, useEffect } from 'react'
import { DateTime } from 'luxon'
import TimeSlotSelector from '@/components/TimeSlotSelector'
import BookingForm from '@/components/BookingForm'
import Cookies from 'js-cookie'

interface PageProps {
  params: Promise<{
    embed_id: string
  }>
}

const BOOKING_COOKIE_KEY = 'booking_completed'
const BOOKING_COOKIE_EXPIRY = 24 // hours

export default function BookingPage({ params }: PageProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [hasRecentBooking, setHasRecentBooking] = useState(false)
  const unwrappedParams = use(params)
  const embedId = unwrappedParams.embed_id

  useEffect(() => {
    // Check for existing booking cookie
    const bookingCookie = Cookies.get(BOOKING_COOKIE_KEY)
    if (bookingCookie) {
      setHasRecentBooking(true)
    }
  }, [])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setShowBookingForm(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowBookingForm(true)
  }

  const handleBookingComplete = () => {
    setSelectedTime(null)
    setShowBookingForm(false)
  }

  if (hasRecentBooking) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-indigo-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold">Booking Completed</h3>
            <p className="text-gray-600">
              Thank you for your booking! You can create another booking after {BOOKING_COOKIE_EXPIRY} hours.
            </p>
            <div className="pt-4">
              <a
                href={`/bookings/${Cookies.get(BOOKING_COOKIE_KEY)}`}
                className="text-indigo-600 hover:text-indigo-700"
              >
                View Booking Details
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* Fixed Header */}
      <div className="flex-none border-b border-gray-100 px-4 py-3">
        <h1 className="text-base font-medium text-gray-900">Schedule Appointment</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-auto">
          <div className="p-4 pb-20">
            {/* Date Selection Slide */}
            {!selectedDate && (
              <div className="animate-fade-in">
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium text-gray-700 mb-3">Select Date</h2>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = DateTime.now().plus({ days: i })
                      const isSelected = selectedDate === date.toISODate()
                      return (
                        <button
                          key={date.toISODate()}
                          onClick={() => handleDateSelect(date.toISODate()!)}
                          className={`
                            flex flex-col items-center justify-center p-2 rounded-md
                            transition-colors duration-150
                            ${isSelected 
                              ? 'bg-indigo-600 text-white' 
                              : 'hover:bg-gray-50 text-gray-700'
                            }
                          `}
                        >
                          <span className="text-xs font-medium">
                            {date.toFormat('EEE')}
                          </span>
                          <span className="text-base font-semibold mt-1">
                            {date.toFormat('d')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Time Selection Slide */}
            {selectedDate && !showBookingForm && (
              <div className="animate-fade-in">
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium text-gray-700 mb-3">Select Time</h2>
                  <div>
                    <TimeSlotSelector
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={handleTimeSelect}
                      onBookingComplete={handleBookingComplete}
                      embedId={embedId}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Booking Form Slide */}
            {showBookingForm && selectedDate && selectedTime && (
              <div className="animate-fade-in">
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium text-gray-700 mb-3">Complete Booking</h2>
                  <div>
                    <BookingForm
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onBookingComplete={handleBookingComplete}
                      embedId={embedId}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer Controls */}
      <div className="flex-none border-t border-gray-100 bg-white relative z-10 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <div className="px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => {
              if (showBookingForm) {
                setShowBookingForm(false)
              } else if (selectedDate) {
                setSelectedDate(null)
              }
            }}
            className={`
              text-sm font-medium px-3 py-1.5 rounded
              transition-colors duration-150
              ${(selectedDate || showBookingForm) 
                ? 'text-gray-600 hover:bg-gray-50' 
                : 'text-gray-400 cursor-not-allowed'
              }
            `}
            disabled={!selectedDate && !showBookingForm}
          >
            ← Back
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`
                    w-2 h-2 rounded-full
                    ${(selectedDate 
                      ? (showBookingForm ? step === 3 : step === 2) 
                      : step === 1)
                      ? 'bg-indigo-600'
                      : 'bg-gray-200'
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 