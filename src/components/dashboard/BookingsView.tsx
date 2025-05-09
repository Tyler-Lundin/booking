'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/database.types';
import { Calendar, Mail, Phone, Clock, Tag, MoreVertical } from 'lucide-react';
import { DateTime } from 'luxon';
import BookingDetailsModal from '../BookingDetailsModal';
import { SupabaseClient } from '@supabase/supabase-js';

type BookingType = Database['public']['Tables']['booking_types']['Row'];
type Embed = Database['public']['Tables']['embeds']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'] & {
  booking_type?: BookingType;
  embed?: Embed;
  project_info?: {
    budget?: string;
    timeline?: string;
    projectType?: string;
    preferredTechStack?: string;
    projectDescription?: string;
    technicalRequirements?: string;
  };
};

type AppointmentMetadata = {
  field_id: string;
  value: string;
  booking_id: string;
};

interface BookingsViewProps {
  embedId: string;
  supabase: SupabaseClient;
  searchQuery: string;
  sortBy: 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

export default function BookingsView({ 
  embedId, 
  supabase, 
  searchQuery,
  sortBy,
  sortOrder 
}: BookingsViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Booking['status'] | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select(`
            *,
            booking_type:booking_types (
              name,
              duration_minutes,
              price
            )
          `)
          .eq('embed_id', embedId)
          .order('date', { ascending: true });

        if (error) throw error;

        // Fetch metadata for all bookings
        const metadataPromises = bookings.map(async (booking: Booking) => {
          const { data: metadata, error: metadataError } = await supabase
            .from('appointment_metadata')
            .select('*')
            .eq('booking_id', booking.id);

          if (metadataError) throw metadataError;
          
          // Convert metadata array to project info object
          const projectInfo = metadata.reduce((acc: Record<string, string>, meta: AppointmentMetadata) => {
            if (meta.field_id) {
              acc[meta.field_id] = meta.value;
            }
            return acc;
          }, {} as Record<string, string>);

          return { 
            bookingId: booking.id, 
            projectInfo: {
              budget: projectInfo.budget,
              timeline: projectInfo.timeline,
              projectType: projectInfo.projectType,
              preferredTechStack: projectInfo.preferredTechStack,
              projectDescription: projectInfo.projectDescription,
              technicalRequirements: projectInfo.technicalRequirements
            }
          };
        });

        const metadataResults = await Promise.all(metadataPromises);

        // Add project info to bookings
        const bookingsWithProjectInfo = bookings.map((booking: Booking) => {
          const metadataResult = metadataResults.find(result => result.bookingId === booking.id);
          return {
            ...booking,
            project_info: metadataResult?.projectInfo
          };
        });

        setBookings(bookingsWithProjectInfo || []);
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
      booking.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.project_info?.projectType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.project_info?.projectDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? (a.name || '').localeCompare(b.name || '')
        : (b.name || '').localeCompare(a.name || '');
    } else {
      return sortOrder === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleStatusUpdate = async (newStatus: Booking['status']) => {
    if (!selectedBooking) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: newStatus }
          : booking
      ));
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking || !window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', selectedBooking.id);

      if (error) throw error;

      setBookings(bookings.filter(booking => booking.id !== selectedBooking.id));
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleCall = (phoneNumber: string | null) => {
    if (!phoneNumber) return;
    window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Booking['status'] | 'all')}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {DateTime.fromISO(booking.date).toLocaleString(DateTime.DATE_MED)} at{' '}
                      {DateTime.fromFormat(booking.start_time, 'HH:mm:ss').toFormat('h:mm a')}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : booking.status === 'completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">{booking.email}</span>
              </div>
              {booking.phone_number && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone size={16} className="mr-2 flex-shrink-0" />
                  <button
                    onClick={() => handleCall(booking.phone_number)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {booking.phone_number}
                  </button>
                </div>
              )}
              {booking.booking_type && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Tag size={16} className="mr-2 flex-shrink-0" />
                  <span>{booking.booking_type.name}</span>
                  <Clock size={16} className="ml-4 mr-2 flex-shrink-0" />
                  <span>{booking.booking_type.duration_minutes}min</span>
                </div>
              )}
              {booking.project_info?.projectType && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Project Details
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div>Type: {booking.project_info.projectType}</div>
                    {booking.project_info.budget && <div>Budget: {booking.project_info.budget}</div>}
                    {booking.project_info.timeline && <div>Timeline: {booking.project_info.timeline}</div>}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="View details"
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
} 