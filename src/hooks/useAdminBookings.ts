"use client"
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { DateTime } from 'luxon';
import { Booking, BookingFilter } from '@/types/database.types';



export default function useAdminBookings() {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState<BookingFilter>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const supabase = createBrowserSupabaseClient();
  
    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings');
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            user:users (
              full_name,
              email
            )
          `)
          .order('date', { ascending: false })
          .order('start_time', { ascending: false });
  
        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId);
  
        if (error) throw error;
        await fetchBookings();
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    };
  
    const formatDate = (date: string) => {
      return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
    };
  
    const formatTime = (time: string) => {
      return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('h:mm a');
    };
  
    const getStatusColor = (status: Booking['status']) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        case 'no-show':
          return 'bg-red-100 text-red-800';
        case 'completed':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    const handleBookingClick = (booking: Booking) => {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    };
  
    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedBookings(bookings.map(booking => booking.id));
      } else {
        setSelectedBookings([]);
      }
    };
  
    const handleSelectBooking = (bookingId: string, checked: boolean) => {
      if (checked) {
        setSelectedBookings(prev => [...prev, bookingId]);
      } else {
        setSelectedBookings(prev => prev.filter(id => id !== bookingId));
      }
    };
  
    const handleBulkDelete = async () => {
      if (selectedBookings.length === 0) return;
  
      try {
        setIsDeleting(true);
        console.log('Attempting to delete bookings:', selectedBookings);
        
        const { data, error } = await supabase
          .from('bookings')
          .delete()
          .in('id', selectedBookings)
          .select();
  
        if (error) {
          console.error('Error deleting bookings:', error);
          throw error;
        }
  
        console.log('Supabase delete response:', data);
        console.log('Successfully deleted bookings:', selectedBookings);
        
        // Update local state
        setBookings(prev => prev.filter(booking => !selectedBookings.includes(booking.id)));
        setSelectedBookings([]);
  
        // Verify the deletion by fetching the bookings again
        const { data: verifyData, error: verifyError } = await supabase
          .from('bookings')
          .select('*')
          .in('id', selectedBookings);
  
        if (verifyError) {
          console.error('Error verifying deletion:', verifyError);
        } else {
          console.log('Verification - Remaining bookings:', verifyData);
        }
      } catch (err) {
        console.error('Error in handleBulkDelete:', err);
      } finally {
        setIsDeleting(false);
      }
    };
  
    const filteredBookings = bookings.filter(booking => {
      if (filter === 'all') return true;
      return booking.status.toLowerCase() === filter.toLowerCase();
    });

    useEffect(() => {
      fetchBookings();
    }, []);
  
    return { 
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
      }
}