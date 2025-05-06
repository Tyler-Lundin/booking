'use client'

import { useEffect, useState } from 'react'
import EmbedList from '@/components/admin/EmbedList'
import CreateEmbedForm from '@/components/admin/CreateEmbedForm'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

interface Embed {
  id: string
  name: string
  client_id: string
  settings: {
    min_booking_notice_hours?: number
    max_attendees?: number
    allowed_booking_types?: string[]
  }
  created_at: string
  updated_at: string
}

export default function EmbedsAdminPage() {
  const [embeds, setEmbeds] = useState<Embed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    fetchEmbeds()
  }, [])

  const fetchEmbeds = async () => {
    try {
      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmbeds(data || [])
    } catch (err) {
      setError('Failed to load embeds')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmbed = async (newEmbed: Omit<Embed, 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('embeds')
        .insert(newEmbed)

      if (error) throw error
      setShowCreateForm(false)
      fetchEmbeds()
    } catch (err) {
      setError('Failed to create embed')
      console.error(err)
    }
  }

  const handleDeleteEmbed = async (embedId: string) => {
    if (!confirm('Are you sure you want to delete this embed?')) return

    try {
      const { error } = await supabase
        .from('embeds')
        .delete()
        .eq('id', embedId)

      if (error) throw error
      fetchEmbeds()
    } catch (err) {
      setError('Failed to delete embed')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Embed Management</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create New Embed
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {showCreateForm && (
              <div className="mb-6">
                <CreateEmbedForm
                  onSubmit={handleCreateEmbed}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            <EmbedList
              embeds={embeds}
              onDelete={handleDeleteEmbed}
            />
          </div>
        </div>
      </div>
  )
} 