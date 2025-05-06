'use client'
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';
import { TrashIcon } from '@heroicons/react/24/outline';
import useAdminBookings from '@/hooks/useAdminBookings';
import Spinner from '@/components/ui/Spinner';

export default function AdminBookingsPage() {
  const { 
    loading,
    bookings, 
    filter, 
    selectedBookings, 
    isDeleting, 
    handleSelectBooking, 
    handleBookingClick,
    formatDate,
    formatTime,
    getStatusColor,
    handleSelectAll, 
    handleBulkDelete, 
    handleStatusUpdate, 
    isModalOpen, 
    selectedBooking, 
    setIsModalOpen, 
    setSelectedBooking, 
    setFilter,
    filteredBookings
  } = useAdminBookings();

  console.log(bookings)
  console.log(loading)

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }


  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Bookings</h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-700">
              Manage and view all bookings in your system.
            </p>
          </div>
          {selectedBookings.length > 0 && (
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                {isDeleting ? 'Deleting...' : `Delete ${selectedBookings.length} booking${selectedBookings.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}
        </div>

        {/* Filters - Improved mobile layout */}
        <div className="mt-4 -mx-4 sm:mx-0">
          <div className="overflow-x-auto px-4 sm:px-0">
            <div className="flex space-x-2 min-w-max pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${filter === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${filter === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${filter === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${filter === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table - Improved mobile layout */}
        <div className="mt-4 sm:mt-8 flow-root -mx-4 sm:mx-0">
          <div className="overflow-x-auto px-4 sm:px-0">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div className="min-w-full divide-y divide-gray-300">
                  {/* Mobile View */}
                  <div className="sm:hidden">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
                          />
                          <button
                            onClick={() => handleBookingClick(booking)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            View
                          </button>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(booking.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {booking.email} - {booking.phone_number}
                          </p>
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 mt-1 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View */}
                  <table className="hidden sm:table min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={selectedBookings.length === filteredBookings.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Time
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Client
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              checked={selectedBookings.includes(booking.id)}
                              onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
                            />
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {formatDate(booking.date)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {booking.email} - {booking.phone_number}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleBookingClick(booking)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
} 