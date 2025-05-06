'use client';

import { useEffect, useState } from 'react';
import { AppointmentField, AppointmentType } from '@/types/database.types';
import { createBrowserSupabaseClient } from '@/lib/supabase/client'; // assumes this returns a browser supabase client

export default function useAdminConfig() {
  const supabase = createBrowserSupabaseClient();
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [fields, setFields] = useState<Record<string, AppointmentField[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: types, error: typeError } = await supabase
          .from('appointment_types')
          .select('*')
          .order('name');

        if (typeError) throw typeError;
        if (!types) throw new Error('No appointment types found');

        setAppointmentTypes(types);

        const fieldsMap: Record<string, AppointmentField[]> = {};

        for (const type of types) {
          const { data: typeFields, error: fieldError } = await supabase
            .from('appointment_fields')
            .select('*')
            .eq('appointment_type_id', type.id)
            .order('order_index');

          if (fieldError) throw fieldError;
          fieldsMap[type.id] = typeFields || [];
        }

        setFields(fieldsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading config');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [supabase]);

  const handleAddType = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .insert({
          name: 'New Appointment Type',
          description: '',
          duration_minutes: 30,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create appointment type');

      setAppointmentTypes(prev => [...prev, data]);
      setFields(prev => ({ ...prev, [data.id]: [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add appointment type');
    }
  };

  const handleUpdateType = async (id: string, updates: Partial<AppointmentType>) => {
    try {
      const { error } = await supabase
        .from('appointment_types')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAppointmentTypes(prev =>
        prev.map(type => (type.id === id ? { ...type, ...updates } : type))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment type');
    }
  };

  const handleAddField = async (typeId: string) => {
    try {
      const newField = {
        appointment_type_id: typeId,
        field_name: 'new_field',
        field_type: 'text',
        label: 'New Field',
        is_required: false,
        order_index: (fields[typeId]?.length || 0) + 1,
      };

      const { data, error } = await supabase
        .from('appointment_fields')
        .insert(newField)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create field');

      setFields(prev => ({
        ...prev,
        [typeId]: [...(prev[typeId] || []), data],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add field');
    }
  };

  const handleUpdateField = async (
    typeId: string,
    fieldId: string,
    updates: Partial<AppointmentField>
  ) => {
    try {
      const { error } = await supabase
        .from('appointment_fields')
        .update(updates)
        .eq('id', fieldId);

      if (error) throw error;

      setFields(prev => ({
        ...prev,
        [typeId]: prev[typeId].map(field =>
          field.id === fieldId ? { ...field, ...updates } : field
        ),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field');
    }
  };

  return {
    appointmentTypes,
    fields,
    loading,
    error,
    handleAddType,
    handleUpdateType,
    handleAddField,
    handleUpdateField,
  };
}
