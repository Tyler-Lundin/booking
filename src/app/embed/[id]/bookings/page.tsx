'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupbaseAuth';
import { useEmbedDashboard } from '@/hooks/useEmbedDashboard';
import BookingsView from '@/components/dashboard/BookingsView';
import BookingsHeader from '@/components/embed/BookingsHeader';
import { SearchAndFilter } from '@/components/dashboard/SearchAndFilter';
import { useState } from 'react';

export default function EmbedBookingsPage() {
  const router = useRouter();
  const { id: embedId } = useParams();
  const { user, loading: authLoading, error: authError, supabase } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const {
    embed,
    loading: embedLoading,
    error: embedError,
    isEditing,
    formData,
    setIsEditing,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleDelete,
  } = useEmbedDashboard({ embedId: embedId as string });

  if (authLoading || embedLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Error</h1>
          <p className="text-gray-600 dark:text-white/80">Please sign in to view this page.</p>
        </div>
      </div>
    );
  }

  if (embedError || !embed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-white/80">{embedError || 'Embed not found'}</p>
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

        <main className="mt-8">
          <div className="px-4 py-6 sm:px-0">
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <BookingsView 
              embedId={embedId as string} 
              supabase={supabase}
              searchQuery={searchQuery}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        </main>
      </div>
    </div>
  );
} 