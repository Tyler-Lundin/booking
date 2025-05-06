'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { isUserAdmin, addAdminUser, removeAdminUser } from '@/utils/admin'

interface AdminControlsProps {
  embedId: string
  userId: string
}

export default function AdminControls({ embedId, userId }: AdminControlsProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    checkAdminStatus()
  }, [embedId, userId])

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await isUserAdmin(embedId, userId)
      setIsAdmin(adminStatus)
    } catch (err) {
      setError('Failed to check admin status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    try {
      await addAdminUser(embedId, userId)
      setIsAdmin(true)
    } catch (err) {
      setError('Failed to add admin')
      console.error(err)
    }
  }

  const handleRemoveAdmin = async () => {
    try {
      await removeAdminUser(embedId, userId)
      setIsAdmin(false)
    } catch (err) {
      setError('Failed to remove admin')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>
  }

  return (
    <div className="flex items-center space-x-4">
      {isAdmin ? (
        <>
          <span className="text-sm text-green-600">Admin</span>
          <button
            onClick={handleRemoveAdmin}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove Admin
          </button>
        </>
      ) : (
        <button
          onClick={handleAddAdmin}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Make Admin
        </button>
      )}
    </div>
  )
} 