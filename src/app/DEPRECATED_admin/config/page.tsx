'use client'
import AppointmentConfig from '@/components/admin/AppointmentConfig'

export default function AdminConfigPage() {

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Appointment Configuration</h1>
              </div>
              <AppointmentConfig />
            </div>
          </div>
        </div>
      </div>
  )
} 