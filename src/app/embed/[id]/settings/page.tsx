'use client';

import { useParams, useRouter } from 'next/navigation';
import BookingsHeader from '@/components/embed/BookingsHeader';
import SupabaseSettings from '@/components/embed/SupabaseSettings';
import BookingSettings from '@/components/embed/BookingSettings';
import AvailabilitySettings from '@/components/embed/AvailabilitySettings';
import BookingTypesSettings from '@/components/embed/BookingTypesSettings';
import { useEmbedDashboard } from '@/hooks/useEmbedDashboard';

export default function EmbedSettingsPage() {
  const router = useRouter();
  const { id: embedId } = useParams();
  const {
    embed,
    loading,
    error,
    isEditing,
    formData,
    isSubmitting,
    hasChanges,
    bookingTypes,
    isBookingTypesLoading,
    setIsEditing,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleCancel,
    handleDelete,
    createBookingType,
    updateBookingType,
    deleteBookingType,
  } = useEmbedDashboard({ embedId: embedId as string });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-white/80">Loading embed settings...</p>
        </div>
      </div>
    );
  }

  if (!embed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Embed not found</h1>
          <p className="mt-2 text-gray-600 dark:text-white/80">The embed you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 flex items-center text-sm text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <BookingsHeader
          embed={embed}
          isEditing={isEditing}
          formData={formData}
          onInputChange={handleInputChange}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
          onSave={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          onCancel={handleCancel}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <SupabaseSettings
              embed={embed}
              isEditing={isEditing}
              formData={formData}
              onInputChange={handleInputChange}
            />

            <BookingSettings
              embed={embed}
              isEditing={isEditing}
              formData={formData}
              onInputChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
            />
          </div>
        </form>

        <div className="mt-8">
          <AvailabilitySettings
            embed={embed}
            isEditing={isEditing}
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="mt-8">
          <BookingTypesSettings
            bookingTypes={bookingTypes}
            isBookingTypesLoading={isBookingTypesLoading}
            onCreateBookingType={createBookingType}
            onUpdateBookingType={updateBookingType}
            onDeleteBookingType={deleteBookingType}
          />
        </div>

        {/* Floating Action Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-white/80">
                  You have unsaved changes
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white/80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    Cancel Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 