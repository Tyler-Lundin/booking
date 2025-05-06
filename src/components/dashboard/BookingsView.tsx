'use client';

import { useState, useEffect } from 'react';
import { Booking, AppointmentMetadata } from '@/types/database.types';
import { Search, Filter, Calendar, User, Mail, Phone } from 'lucide-react';

interface BookingsViewProps {
  embedId: string;
  supabase: any;
}

export default function BookingsView({ embedId, supabase }: BookingsViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Booking['status'] | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingMetadata, setBookingMetadata] = useState<Record<string, AppointmentMetadata[]>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('embed_id', embedId)
          .order('date', { ascending: true });

        if (error) throw error;

        // Fetch metadata for all bookings
        const metadataPromises = data.map(async (booking: Booking) => {
          const { data: metadata, error: metadataError } = await supabase
            .from('appointment_metadata')
            .select('*')
            .eq('booking_id', booking.id);

          if (metadataError) throw metadataError;
          return { bookingId: booking.id, metadata };
        });

        const metadataResults = await Promise.all(metadataPromises);
        const metadataMap = metadataResults.reduce((acc, { bookingId, metadata }) => {
          acc[bookingId] = metadata;
          return acc;
        }, {} as Record<string, AppointmentMetadata[]>);

        setBookings(data);
        setBookingMetadata(metadataMap);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [embedId, supabase]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Booking['status'] | 'all')}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    {new Date(booking.date).toLocaleDateString()} at{' '}
                    {new Date(`2000-01-01T${booking.start_time}`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : booking.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{booking.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>{booking.phone_number}</span>
              </div>
            </div>

            {/* Custom Fields */}
            {bookingMetadata[booking.id]?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bookingMetadata[booking.id].map((metadata) => (
                    <div key={metadata.id} className="text-sm">
                      <span className="font-medium text-gray-600">{metadata.field_id}:</span>{' '}
                      <span className="text-gray-500">{metadata.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {/* Add detailed booking information here */}
          </div>
        </div>
      )}
    </div>
  );
} 