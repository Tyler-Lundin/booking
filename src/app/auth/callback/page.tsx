'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get('error')
        const errorCode = searchParams.get('error_code')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          let errorMessage = 'Authentication failed'
          if (errorCode === 'otp_expired') {
            errorMessage = 'The email link has expired. Please try signing up again.'
          } else if (errorDescription) {
            errorMessage = errorDescription.replace(/\+/g, ' ')
          }
          throw new Error(errorMessage)
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session?.user) throw new Error('No user found after email confirmation')

        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle()

        // If profile does NOT exist, just log a warning (creation is handled by DB trigger)
        if (!existingUser) {
          console.warn('[AuthCallback] No user profile found, relying on trigger to create it.')
        }

        // Check if user already has a project
        const { data: embeds } = await supabase
          .from('embeds')
          .select('id')
          .contains('admin_users', [session.user.id])
          .limit(1)

        if (embeds && embeds.length > 0) {
          router.push('/dashboard')
        } else {
          router.push('/auth/create-project')
        }
      } catch (err) {
        console.error('Error in auth callback:', err)
        setError(err instanceof Error ? err.message : 'An error occurred during authentication')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router, supabase, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Verifying your email...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-4 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-600">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return null
}
