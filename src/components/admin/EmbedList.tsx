'use client'

import { useState } from 'react'
import { DateTime } from 'luxon'

interface Embed {
  id: string
  name: string
  client_id: string
  settings: {
    min_booking_notice_hours?: number
    max_attendees?: number
    allowed_booking_types?: string[]
  }
  created_at: string
  updated_at: string
}

interface EmbedListProps {
  embeds: Embed[]
  onDelete: (embedId: string) => void
}

export default function EmbedList({ embeds, onDelete }: EmbedListProps) {
  const [expandedEmbed, setExpandedEmbed] = useState<string | null>(null)

  const toggleExpand = (embedId: string) => {
    setExpandedEmbed(expandedEmbed === embedId ? null : embedId)
  }

  return (
    <div className="space-y-4">
      {embeds.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No embeds found. Create your first embed to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {embeds.map((embed) => (
            <div
              key={embed.id}
              className="border rounded-lg overflow-hidden"
            >
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(embed.id)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{embed.name}</h3>
                  <p className="text-sm text-gray-500">ID: {embed.id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Created {DateTime.fromISO(embed.created_at).toRelative()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(embed.id)
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedEmbed === embed.id && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Settings</h4>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-gray-500">Minimum Notice</dt>
                          <dd className="text-sm text-gray-900">
                            {embed.settings.min_booking_notice_hours || 'Not set'} hours
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Max Attendees</dt>
                          <dd className="text-sm text-gray-900">
                            {embed.settings.max_attendees || 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Allowed Booking Types</dt>
                          <dd className="text-sm text-gray-900">
                            {embed.settings.allowed_booking_types?.join(', ') || 'All types allowed'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Embed Code</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <code className="text-sm text-gray-700">
                          {`<iframe src="${window.location.origin}/${embed.id}" width="100%" height="600" frameborder="0"></iframe>`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 