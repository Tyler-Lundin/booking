'use client'
import useAdminConfig from '@/hooks/useAdminConfig'
import { FieldType } from '@/types/database.types'

export default function AppointmentConfig() {
  const { appointmentTypes, fields, loading, error, handleAddType, handleUpdateType, handleAddField, handleUpdateField } = useAdminConfig()
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
                    checked={type.is_active ?? false}
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
                      checked={field.is_required ?? false}
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