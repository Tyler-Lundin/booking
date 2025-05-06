'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { isUserAdmin } from '@/utils/admin'
import { Embed } from '@/types/database.types'

interface AdminDashboardProps {
  params: {
    embedId: string
  }
}

export default function AdminDashboardPage({ params }: AdminDashboardProps) {
  const [embed, setEmbed] = useState<Embed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const isAdmin = await isUserAdmin(params.embedId, user.id)
        if (!isAdmin) {
          router.push('/dashboard')
          return
        }

        // Fetch embed details
        const { data: embedData, error: embedError } = await supabase
          .from('embeds')
          .select('*')
          .eq('id', params.embedId)
          .single()

        if (embedError) throw embedError
        setEmbed(embedData)
      } catch (err) {
        setError('Failed to load dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [params.embedId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!embed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Project not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{embed.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Project ID: {embed.id}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Base URL: {embed.client_id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Project Settings</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {embed.settings?.company_name || 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Minimum Booking Notice</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {embed.settings?.min_booking_notice_hours || 'Not set'} hours
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Maximum Attendees</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {embed.settings?.max_attendees || 'Not set'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Embed Code</h2>
                <div className="bg-gray-100 p-3 rounded-md">
                  <code className="text-sm text-gray-700">
                    {`<iframe src="${window.location.origin}/${embed.id}" width="100%" height="600" frameborder="0"></iframe>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 