import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

interface CreateProjectFormProps {
  userId: string
  onComplete: () => void
}

export default function CreateProjectForm({ userId, onComplete }: CreateProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    companyName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create the embed/project
      const { data: embed, error: embedError } = await supabase
        .from('embeds')
        .insert({
          name: formData.name,
          client_id: formData.baseUrl,
          settings: {
            company_name: formData.companyName,
          },
          admin_users: [userId], // Add the user as an admin
        })
        .select()
        .single()

      if (embedError) throw embedError

      // Update user metadata to include their project
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          default_embed_id: embed.id,
        },
      })

      if (userError) throw userError

      onComplete()
    } catch (err) {
      setError('Failed to create project. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Create Your Project</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., My Booking System"
          />
        </div>

        <div>
          <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700">
            Base URL
          </label>
          <input
            type="text"
            id="baseUrl"
            name="baseUrl"
            value={formData.baseUrl}
            onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., my-company"
          />
          <p className="mt-1 text-sm text-gray-500">
            This will be used in your booking URL: booking.example.com/{formData.baseUrl || 'your-url'}
          </p>
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., My Company Inc."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
} 