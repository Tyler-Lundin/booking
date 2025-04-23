'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DateTime } from 'luxon';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  user?: {
    full_name: string | null;
    email: string | null;
  };
  created_at: string;
  updated_at: string;
}

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusUpdate: (bookingId: string, newStatus: string) => Promise<void>;
}

export default function BookingDetailsModal({ isOpen, onClose, booking, onStatusUpdate }: BookingDetailsModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!booking) return null;

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
  };

  const formatTime = (time: string) => {
    return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('h:mm a');
  };

  const formatDateTime = (dateTime: string) => {
    return DateTime.fromISO(dateTime).toLocaleString(DateTime.DATETIME_MED);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await onStatusUpdate(booking.id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-t-lg sm:rounded-lg bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-lg">
                {/* Header with close button */}
                <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Booking Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Client Information</h4>
                      <p className="mt-1 text-sm text-gray-500">{booking.user?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{booking.user?.email || 'No email'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Appointment Details</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(booking.date)} at {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Status</h4>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleStatusUpdate('confirmed')}
                            disabled={updatingStatus || booking.status === 'confirmed'}
                            className="inline-flex items-center justify-center rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:hover:bg-green-50"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate('cancelled')}
                            disabled={updatingStatus || booking.status === 'cancelled'}
                            className="inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                        <p className="mt-1 text-sm text-gray-500">{booking.notes}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Timestamps</h4>
                      <p className="mt-1 text-sm text-gray-500">Created: {formatDateTime(booking.created_at)}</p>
                      <p className="text-sm text-gray-500">Last Updated: {formatDateTime(booking.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 