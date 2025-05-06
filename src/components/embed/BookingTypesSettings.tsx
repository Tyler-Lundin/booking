'use client';

import { useState } from 'react';
import { Database } from '@/types/database.types';

type BookingType = Database['public']['Tables']['booking_types']['Row'];

interface BookingTypesSettingsProps {
  bookingTypes: BookingType[];
  isBookingTypesLoading: boolean;
  onCreateBookingType: (data: Omit<BookingType, 'id' | 'created_at' | 'updated_at' | 'embed_id'>) => Promise<void>;
  onUpdateBookingType: (id: string, data: Partial<BookingType>) => Promise<void>;
  onDeleteBookingType: (id: string) => Promise<void>;
}

export default function BookingTypesSettings({
  bookingTypes,
  isBookingTypesLoading,
  onCreateBookingType,
  onUpdateBookingType,
  onDeleteBookingType,
}: BookingTypesSettingsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newBookingType, setNewBookingType] = useState<{
    name: string;
    description: string;
    duration_minutes: number;
    price: number | null;
    is_active: boolean;
  }>({
    name: '',
    description: '',
    duration_minutes: 30,
    price: null,
    is_active: true,
  });

  const handleCreate = async () => {
    try {
      await onCreateBookingType({
        ...newBookingType,
        price: newBookingType.price ?? 0,
      });
      setIsCreating(false);
      setNewBookingType({
        name: '',
        description: '',
        duration_minutes: 30,
        price: null,
        is_active: true,
      });
    } catch (err) {
      console.error('Failed to create booking type:', err);
    }
  };

  if (isBookingTypesLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Booking Types</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          Add Booking Type
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">New Booking Type</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newBookingType.name}
                onChange={(e) => setNewBookingType({ ...newBookingType, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={newBookingType.description}
                onChange={(e) => setNewBookingType({ ...newBookingType, description: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={newBookingType.duration_minutes}
                  onChange={(e) => setNewBookingType({ ...newBookingType, duration_minutes: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={newBookingType.price ?? ''}
                  onChange={(e) => setNewBookingType({ 
                    ...newBookingType, 
                    price: e.target.value === '' ? null : parseFloat(e.target.value) 
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {bookingTypes.map((type) => (
          <div key={type.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{type.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{type.duration_minutes} minutes</span>
                  <span>${type.price ?? 0}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    type.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {type.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateBookingType(type.id, { is_active: !type.is_active })}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {type.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => onDeleteBookingType(type.id)}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 