'use client';

import { useState, useEffect } from 'react';
import { AppointmentType, AppointmentField } from '@/types/database.types';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';

interface AppointmentTypesViewProps {
  embedId: string;
  supabase: any;
}

export default function AppointmentTypesView({ embedId, supabase }: AppointmentTypesViewProps) {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);
  const [fields, setFields] = useState<Record<string, AppointmentField[]>>({});

  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('appointment_types')
          .select('*')
          .eq('embed_id', embedId)
          .order('name');

        if (error) throw error;

        // Fetch fields for each appointment type
        const fieldsPromises = data.map(async (type: AppointmentType) => {
          const { data: typeFields, error: fieldsError } = await supabase
            .from('appointment_fields')
            .select('*')
            .eq('appointment_type_id', type.id);

          if (fieldsError) throw fieldsError;
          return { typeId: type.id, fields: typeFields };
        });

        const fieldsResults = await Promise.all(fieldsPromises);
        const fieldsMap = fieldsResults.reduce((acc, { typeId, fields }) => {
          acc[typeId] = fields;
          return acc;
        }, {} as Record<string, AppointmentField[]>);

        setAppointmentTypes(data);
        setFields(fieldsMap);
      } catch (error) {
        console.error('Error fetching appointment types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentTypes();
  }, [embedId, supabase]);

  const handleDelete = async (typeId: string) => {
    if (!confirm('Are you sure you want to delete this appointment type?')) return;

    try {
      const { error } = await supabase
        .from('appointment_types')
        .delete()
        .eq('id', typeId);

      if (error) throw error;

      setAppointmentTypes(types => types.filter(t => t.id !== typeId));
    } catch (error) {
      console.error('Error deleting appointment type:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Appointment Types</h2>
        <button
          onClick={() => {
            setEditingType(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointmentTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                {type.description && (
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingType(type);
                    setShowModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock size={16} className="mr-2" />
              <span>{type.duration_minutes} minutes</span>
            </div>

            {fields[type.id]?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Fields</h4>
                <div className="space-y-2">
                  {fields[type.id].map((field) => (
                    <div key={field.id} className="text-sm">
                      <span className="font-medium text-gray-600">{field.label}</span>
                      {field.is_required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  type.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {type.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Type Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingType ? 'Edit' : 'Add'} Appointment Type
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {/* Add appointment type form here */}
          </div>
        </div>
      )}
    </div>
  );
} 