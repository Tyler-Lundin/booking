'use client'

import { useState } from 'react'

interface CreateEmbedFormProps {
  onSubmit: (embed: {
    id: string
    name: string
    client_id: string
    supabase_project_id: string
    supabase_url: string
    supabase_api_key: string
    supabase_service_role_key?: string
    supabase_database_url?: string
    supabase_database_name?: string
    settings: {
      min_booking_notice_hours?: number
      max_attendees?: number
      allowed_booking_types?: string[]
    }
  }) => void
  onCancel: () => void
}

export default function CreateEmbedForm({ onSubmit, onCancel }: CreateEmbedFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    client_id: '',
    supabase_project_id: '',
    supabase_url: '',
    supabase_api_key: '',
    supabase_service_role_key: '',
    supabase_database_url: '',
    supabase_database_name: '',
    settings: {
      min_booking_notice_hours: 2,
      max_attendees: 10,
      allowed_booking_types: ['consultation', 'meeting', 'appointment']
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            Embed ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., client-name"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Client Name Booking"
          />
        </div>

        <div>
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
            Client ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="client_id"
            name="client_id"
            value={formData.client_id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., client-123"
          />
        </div>

        <div>
          <label htmlFor="supabase_project_id" className="block text-sm font-medium text-gray-700">
            Supabase Project ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="supabase_project_id"
            name="supabase_project_id"
            value={formData.supabase_project_id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your Supabase project ID"
          />
        </div>

        <div>
          <label htmlFor="supabase_url" className="block text-sm font-medium text-gray-700">
            Supabase URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="supabase_url"
            name="supabase_url"
            value={formData.supabase_url}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your Supabase URL"
          />
        </div>

        <div>
          <label htmlFor="supabase_api_key" className="block text-sm font-medium text-gray-700">
            Supabase API Key <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="supabase_api_key"
            name="supabase_api_key"
            value={formData.supabase_api_key}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your Supabase API key"
          />
        </div>

        <div>
          <label htmlFor="supabase_service_role_key" className="block text-sm font-medium text-gray-500">
            Service Role Key (Optional)
          </label>
          <input
            type="password"
            id="supabase_service_role_key"
            name="supabase_service_role_key"
            value={formData.supabase_service_role_key}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your service role key"
          />
        </div>

        <div>
          <label htmlFor="supabase_database_url" className="block text-sm font-medium text-gray-500">
            Database URL (Optional)
          </label>
          <input
            type="text"
            id="supabase_database_url"
            name="supabase_database_url"
            value={formData.supabase_database_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your database URL"
          />
        </div>

        <div>
          <label htmlFor="supabase_database_name" className="block text-sm font-medium text-gray-500">
            Database Name (Optional)
          </label>
          <input
            type="text"
            id="supabase_database_name"
            name="supabase_database_name"
            value={formData.supabase_database_name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your database name"
          />
        </div>

        <div>
          <label htmlFor="settings.min_booking_notice_hours" className="block text-sm font-medium text-gray-700">
            Minimum Booking Notice (hours)
          </label>
          <input
            type="number"
            id="settings.min_booking_notice_hours"
            name="settings.min_booking_notice_hours"
            value={formData.settings.min_booking_notice_hours}
            onChange={handleInputChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="settings.max_attendees" className="block text-sm font-medium text-gray-700">
            Maximum Attendees
          </label>
          <input
            type="number"
            id="settings.max_attendees"
            name="settings.max_attendees"
            value={formData.settings.max_attendees}
            onChange={handleInputChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Embed
        </button>
      </div>
    </form>
  )
} 