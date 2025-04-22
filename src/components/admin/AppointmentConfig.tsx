'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type AppointmentType = Database['public']['Tables']['appointment_types']['Row']
type AppointmentField = Database['public']['Tables']['appointment_fields']['Row']
type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'checkbox'

export default function AppointmentConfig() {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([])
  const [fields, setFields] = useState<Record<string, AppointmentField[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAppointmentTypes()
  }, [])

  const fetchAppointmentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .select('*')
        .order('name')

      if (error) throw error
      setAppointmentTypes(data || [])

      // Fetch fields for each appointment type
      const fieldsData: Record<string, AppointmentField[]> = {}
      for (const type of data || []) {
        const { data: typeFields, error: fieldsError } = await supabase
          .from('appointment_fields')
          .select('*')
          .eq('appointment_type_id', type.id)
          .order('order_index')

        if (fieldsError) throw fieldsError
        fieldsData[type.id] = typeFields || []
      }
      setFields(fieldsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAddType = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .insert({
          name: 'New Appointment Type',
          description: '',
          duration_minutes: 30,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      setAppointmentTypes(prev => [...prev, data])
      setFields(prev => ({ ...prev, [data.id]: [] }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add appointment type')
    }
  }

  const handleUpdateType = async (id: string, updates: Partial<AppointmentType>) => {
    try {
      const { error } = await supabase
        .from('appointment_types')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      setAppointmentTypes(prev =>
        prev.map(type => (type.id === id ? { ...type, ...updates } : type))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment type')
    }
  }

  const handleAddField = async (typeId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointment_fields')
        .insert({
          appointment_type_id: typeId,
          field_name: 'new_field',
          field_type: 'text',
          label: 'New Field',
          is_required: false,
          order_index: (fields[typeId]?.length || 0) + 1
        })
        .select()
        .single()

      if (error) throw error
      setFields(prev => ({
        ...prev,
        [typeId]: [...(prev[typeId] || []), data]
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add field')
    }
  }

  const handleUpdateField = async (typeId: string, fieldId: string, updates: Partial<AppointmentField>) => {
    try {
      const { error } = await supabase
        .from('appointment_fields')
        .update(updates)
        .eq('id', fieldId)

      if (error) throw error
      setFields(prev => ({
        ...prev,
        [typeId]: prev[typeId].map(field =>
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointment Types</h2>
        <button
          onClick={handleAddType}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Appointment Type
        </button>
      </div>

      <div className="space-y-6">
        {appointmentTypes.map(type => (
          <div key={type.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={type.name}
                onChange={e => handleUpdateType(type.id, { name: e.target.value })}
                className="text-xl font-semibold border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={type.is_active}
                    onChange={e => handleUpdateType(type.id, { is_active: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Active</span>
                </label>
                <button
                  onClick={() => handleAddField(type.id)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Add Field
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {fields[type.id]?.map(field => (
                <div key={field.id} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={field.label}
                    onChange={e => handleUpdateField(type.id, field.id, { label: e.target.value })}
                    className="flex-1 border rounded-md px-3 py-2"
                    placeholder="Field Label"
                  />
                  <select
                    value={field.field_type}
                    onChange={e => handleUpdateField(type.id, field.id, { field_type: e.target.value as FieldType })}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="textarea">Text Area</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.is_required}
                      onChange={e => handleUpdateField(type.id, field.id, { is_required: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Required</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 