'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import CreateProjectForm from '@/components/auth/CreateProjectForm'

export default function CreateProjectPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) throw error

        if (!user) {
          router.push('/login')
          return
        }

        // Check if user already has a project
        const { data: embeds } = await supabase
          .from('embeds')
          .select('id')
          .contains('admin_users', [user.id])
          .limit(1)

        if (embeds && embeds.length > 0) {
          // User already has a project, redirect to dashboard
          router.push('/dashboard')
          return
        }

        setUserId(user.id)
      } catch (err) {
        setError('Failed to verify your account. Please try again.')
        console.error(err)
      }
    }

    checkAuth()
  }, [router])

  const handleProjectComplete = () => {
    router.push('/dashboard')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return <CreateProjectForm userId={userId} onComplete={handleProjectComplete} />
} 