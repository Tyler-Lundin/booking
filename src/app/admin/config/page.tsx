'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AppointmentConfig from '@/components/admin/AppointmentConfig'

export default function AdminConfigPage() {
  const { signOut } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Appointment Configuration</h1>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </div>
              <AppointmentConfig />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 