'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { DateTime } from 'luxon';
import { Trash2 } from 'lucide-react';
import { Database } from '@/types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  booking_type?: {
    name: string;
    duration_minutes: number;
    price: number | null;
  };
};

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusUpdate: (bookingId: string, newStatus: string) => Promise<void>;
  onDelete?: (bookingId: string) => Promise<void>;
}

export default function BookingDetailsModal({ isOpen, onClose, booking, onStatusUpdate, onDelete }: BookingDetailsModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await onStatusUpdate(booking.id, newStatus);
    } catch (error: unknown) {
      console.error('Error updating booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to update booking');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(booking.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  // Parse metadata if it exists
  const metadata = booking.metadata as {
    projectType?: string;
    budget?: string;
    timeline?: string;
    projectDescription?: string;
    technicalRequirements?: string;
    preferredTechStack?: string;
    [key: string]: string | undefined;
  } | null;

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
          <div className="fixed inset-0 bg-gray-500 dark:bg-neutral-900 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-t-lg sm:rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full sm:my-8 sm:max-w-2xl">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
                      Booking Details
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Client Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Client Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Name</p>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{booking.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{booking.email || 'No email'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{booking.phone_number || 'No phone'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                          <div className="mt-1 flex items-center gap-2">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusUpdate(e.target.value)}
                              disabled={updatingStatus}
                              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                            {updatingStatus && (
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Information */}
                    {metadata && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Project Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {metadata.budget && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Budget</p>
                              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{metadata.budget}</p>
                            </div>
                          )}
                          {metadata.timeline && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Timeline</p>
                              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{metadata.timeline}</p>
                            </div>
                          )}
                          {metadata.projectType && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Project Type</p>
                              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{metadata.projectType}</p>
                            </div>
                          )}
                          {metadata.preferredTechStack && (
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Preferred Tech Stack</p>
                              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{metadata.preferredTechStack}</p>
                            </div>
                          )}
                        </div>
                        {metadata.projectDescription && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Project Description</p>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                              {metadata.projectDescription}
                            </p>
                          </div>
                        )}
                        {metadata.technicalRequirements && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Technical Requirements</p>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                              {metadata.technicalRequirements}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {booking.notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{booking.notes}</p>
                      </div>
                    )}

                    {/* Advanced Information */}
                    <div>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        />
                        Advanced Information
                      </button>
                      
                      {showAdvanced && (
                        <div className="mt-4 space-y-6">
                          {/* Appointment Details */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Appointment Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(booking.date)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Time</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                </p>
                              </div>
                              {booking.booking_type && (
                                <>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Type</p>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{booking.booking_type.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{booking.booking_type.duration_minutes} minutes</p>
                                  </div>
                                  {booking.booking_type.price && booking.booking_type.price > 1 && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">Price</p>
                                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        ${booking.booking_type.price.toFixed(2)}
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}
                              {booking.attendee_count && booking.attendee_count > 1 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">Attendees</p>
                                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{booking.attendee_count}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* System Information */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">System Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDateTime(booking.created_at)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDateTime(booking.updated_at)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Booking ID</p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">{booking.id}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Admin Controls */}
                    {onDelete && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                          >
                            {isDeleting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Booking
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
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