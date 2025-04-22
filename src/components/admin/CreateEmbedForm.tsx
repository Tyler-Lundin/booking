'use client'

import { useState } from 'react'

interface CreateEmbedFormProps {
  onSubmit: (embed: {
    id: string
    name: string
    client_id: string
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
            Embed ID
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
            Display Name
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
            Client ID
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