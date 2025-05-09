'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CheckEmailPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const [isGmail, setIsGmail] = useState(false)
  const [isYahoo, setIsYahoo] = useState(false)
  const [isOutlook, setIsOutlook] = useState(false)
  const [isApple, setIsApple] = useState(false)

  useEffect(() => {
    if (email) {
      setIsGmail(email.endsWith('@gmail.com'))
      setIsYahoo(email.endsWith('@yahoo.com'))
      setIsOutlook(email.endsWith('@outlook.com'))
      setIsApple(email.endsWith('@apple.com'))
    }
  }, [email])

  useEffect(() => {
    // Get the email from the URL query params
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const handleResendEmail = async () => {
    if (!email) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a confirmation link to {email || 'your email address'}
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please click the link in the email to confirm your account and continue setting up your project.
          </p>
          {isGmail && (
            <Link
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center text-sm text-gray-600"
            >
              Open Gmail <ArrowRightIcon className="w-4 h-4 inline-block" />
            </Link>
          )}
          {isYahoo && (
            <Link
              href="https://mail.yahoo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center text-sm text-gray-600"
            >
              Open Yahoo Mail <ArrowRightIcon className="w-4 h-4 inline-block" />
            </Link>
          )}
          {isOutlook && (
            <Link
              href="https://outlook.live.com/mail/inbox"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center text-sm text-gray-600"
            >
              Open Outlook <ArrowRightIcon className="w-4 h-4 inline-block" />
            </Link>
          )}
          {isApple && (
            <Link
              href="https://www.icloud.com/mail"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center text-sm text-gray-600"
            >
              Open Apple Mail <ArrowRightIcon className="w-4 h-4 inline-block" />
            </Link>
          )}


        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              Confirmation email resent successfully!
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {email && (
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Resending...' : 'Resend confirmation email'}
            </button>
          )}

          <button
            onClick={() => router.push('/login')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to login
          </button>
        </div>
      </div>
    </div>
  )
} 