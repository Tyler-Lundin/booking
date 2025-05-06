import { useState, useEffect } from 'react';
import { Plus, Clock, Trash2, Copy, RotateCcw, Calendar, ChevronDown } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TIME_TEMPLATES = [
  {
    name: 'Standard Business Hours',
    slots: [
      { day_of_week: 1, start_time: '09:00', end_time: '10:00', buffer_minutes: 15 },
      { day_of_week: 1, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 1, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 1, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 1, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 1, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
      { day_of_week: 1, start_time: '16:00', end_time: '17:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '09:00', end_time: '10:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
      { day_of_week: 2, start_time: '16:00', end_time: '17:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '09:00', end_time: '10:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
      { day_of_week: 3, start_time: '16:00', end_time: '17:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '09:00', end_time: '10:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
      { day_of_week: 4, start_time: '16:00', end_time: '17:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '09:00', end_time: '10:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
      { day_of_week: 5, start_time: '16:00', end_time: '17:00', buffer_minutes: 15 },
    ],
  },
  {
    name: 'Extended Hours',
    slots: [
      { day_of_week: 1, start_time: '08:00', end_time: '09:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '09:00', end_time: '10:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '10:00', end_time: '11:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '11:00', end_time: '12:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '13:00', end_time: '14:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '14:00', end_time: '15:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '15:00', end_time: '16:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '16:00', end_time: '17:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '17:00', end_time: '18:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '18:00', end_time: '19:00', buffer_minutes: 30 },
      { day_of_week: 1, start_time: '19:00', end_time: '20:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '08:00', end_time: '09:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '09:00', end_time: '10:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '10:00', end_time: '11:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '11:00', end_time: '12:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '13:00', end_time: '14:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '14:00', end_time: '15:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '15:00', end_time: '16:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '16:00', end_time: '17:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '17:00', end_time: '18:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '18:00', end_time: '19:00', buffer_minutes: 30 },
      { day_of_week: 2, start_time: '19:00', end_time: '20:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '08:00', end_time: '09:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '09:00', end_time: '10:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '10:00', end_time: '11:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '11:00', end_time: '12:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '13:00', end_time: '14:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '14:00', end_time: '15:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '15:00', end_time: '16:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '16:00', end_time: '17:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '17:00', end_time: '18:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '18:00', end_time: '19:00', buffer_minutes: 30 },
      { day_of_week: 3, start_time: '19:00', end_time: '20:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '08:00', end_time: '09:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '09:00', end_time: '10:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '10:00', end_time: '11:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '11:00', end_time: '12:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '13:00', end_time: '14:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '14:00', end_time: '15:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '15:00', end_time: '16:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '16:00', end_time: '17:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '17:00', end_time: '18:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '18:00', end_time: '19:00', buffer_minutes: 30 },
      { day_of_week: 4, start_time: '19:00', end_time: '20:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '08:00', end_time: '09:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '09:00', end_time: '10:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '10:00', end_time: '11:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '11:00', end_time: '12:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '13:00', end_time: '14:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '14:00', end_time: '15:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '15:00', end_time: '16:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '16:00', end_time: '17:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '17:00', end_time: '18:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '18:00', end_time: '19:00', buffer_minutes: 30 },
      { day_of_week: 5, start_time: '19:00', end_time: '20:00', buffer_minutes: 30 },
    ],
  },
  {
    name: 'Weekend Only',
    slots: [
      { day_of_week: 0, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 0, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 0, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 0, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 0, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
      { day_of_week: 6, start_time: '10:00', end_time: '11:00', buffer_minutes: 15 },
      { day_of_week: 6, start_time: '11:00', end_time: '12:00', buffer_minutes: 15 },
      { day_of_week: 6, start_time: '13:00', end_time: '14:00', buffer_minutes: 15 },
      { day_of_week: 6, start_time: '14:00', end_time: '15:00', buffer_minutes: 15 },
      { day_of_week: 6, start_time: '15:00', end_time: '16:00', buffer_minutes: 15 },
    ],
  },
];

interface AvailabilitySettingsProps {
  embed: Database['public']['Tables']['embeds']['Row'];
  isEditing: boolean;
  formData: Partial<Database['public']['Tables']['embeds']['Row']>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  buffer_minutes: number | null;
  created_at: string | null;
  updated_at: string | null;
  embed_id: string;
  is_recurring: boolean | null;
  start_date: string | null;
  end_date: string | null;
}

export default function AvailabilitySettings({
  embed,
  isEditing,
  formData,
  onInputChange,
}: AvailabilitySettingsProps) {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [newSlot, setNewSlot] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '17:00',
    buffer_minutes: 15,
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [copyFromDay, setCopyFromDay] = useState<number | null>(null);
  const [copyToDays, setCopyToDays] = useState<number[]>([]);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchAvailability();
  }, [embed.id, supabase]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('embed_id', embed.id)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;

    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
      setAvailability(slots => slots.filter(s => s.id !== slotId));
    } catch (error) {
      console.error('Error deleting availability slot:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL availability slots? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('embed_id', embed.id);

      if (error) throw error;
      setAvailability([]);
    } catch (error) {
      console.error('Error deleting all availability slots:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('availability')
        .insert([{
          day_of_week: newSlot.day_of_week,
          start_time: newSlot.start_time,
          end_time: newSlot.end_time,
          buffer_minutes: newSlot.buffer_minutes,
          user_id: userData.user.id,
          embed_id: embed.id,
        }]);

      if (error) throw error;
      await fetchAvailability();

      setShowModal(false);
      setNewSlot({
        day_of_week: 0,
        start_time: '09:00',
        end_time: '17:00',
        buffer_minutes: 15,
      });
    } catch (error) {
      console.error('Error creating availability slot:', error);
    }
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;

    const template = TIME_TEMPLATES.find(t => t.name === selectedTemplate);
    if (!template) return;

    try {
      // Delete existing slots
      await supabase
        .from('availability')
        .delete()
        .eq('embed_id', embed.id);

      // Insert new slots with embed_id
      const { error } = await supabase
        .from('availability')
        .insert(
          template.slots.map(slot => ({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            buffer_minutes: slot.buffer_minutes,
            embed_id: embed.id,
            is_recurring: true,
            start_date: null,
            end_date: null,
          }))
        );

      if (error) throw error;
      await fetchAvailability();
      setShowTemplateModal(false);
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error applying template:', error);
    }
  };

  const handleCopySlots = async () => {
    if (copyFromDay === null || copyToDays.length === 0) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const slotsToCopy = availability.filter(slot => slot.day_of_week === copyFromDay);
      
      const newSlots = copyToDays.flatMap(day => 
        slotsToCopy.map(slot => ({
          ...slot,
          id: undefined,
          day_of_week: day,
          user_id: userData.user.id,
          embed_id: embed.id,
        }))
      );

      const { error } = await supabase
        .from('availability')
        .insert(newSlots);

      if (error) throw error;
      await fetchAvailability();
      setCopyFromDay(null);
      setCopyToDays([]);
    } catch (error) {
      console.error('Error copying slots:', error);
    }
  };

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availability.filter(slot => slot.day_of_week === dayOfWeek);
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
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Availability Settings</h2>
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Calendar size={20} />
                Templates
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Time Slot
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={20} />
                Delete All
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS_OF_WEEK.map((day, index) => {
            const daySlots = getAvailabilityForDay(index);
            return (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{day}</h3>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCopyFromDay(index);
                          setCopyToDays([]);
                        }}
                        className="text-gray-400 hover:text-indigo-600"
                        title="Copy from this day"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (copyFromDay !== null) {
                            setCopyToDays(prev => 
                              prev.includes(index) 
                                ? prev.filter(d => d !== index)
                                : [...prev, index]
                            );
                          }
                        }}
                        className={`text-gray-400 ${
                          copyToDays.includes(index) 
                            ? 'text-indigo-600' 
                            : 'hover:text-indigo-600'
                        }`}
                        title={copyFromDay === null ? "Select a source day first" : "Copy to this day"}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                {daySlots.length > 0 ? (
                  <div className="space-y-3">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(`2000-01-01T${slot.end_time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {slot.buffer_minutes && slot.buffer_minutes > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                (+{slot.buffer_minutes}m buffer)
                              </span>
                            )}
                          </span>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No availability set</p>
                )}
              </div>
            );
          })}
        </div>

        {copyFromDay !== null && copyToDays.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Copy slots from {DAYS_OF_WEEK[copyFromDay]} to {copyToDays.length} day{copyToDays.length > 1 ? 's' : ''}?
              </span>
              <button
                onClick={handleCopySlots}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  setCopyFromDay(null);
                  setCopyToDays([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Time Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add Availability Slot
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Day of Week
                </label>
                <select
                  id="day_of_week"
                  value={newSlot.day_of_week}
                  onChange={(e) => setNewSlot({ ...newSlot, day_of_week: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="buffer_minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buffer Time (minutes)
                </label>
                <input
                  type="number"
                  id="buffer_minutes"
                  value={newSlot.buffer_minutes}
                  onChange={(e) => setNewSlot({ ...newSlot, buffer_minutes: Number(e.target.value) })}
                  min="0"
                  max="60"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Apply Time Template
              </h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Template
                  </label>
                  <select
                    id="template"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a template</option>
                    {TIME_TEMPLATES.map((template) => (
                      <option key={template.name} value={template.name}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTemplate && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Template Preview
                    </h3>
                    <div className="space-y-4">
                      {DAYS_OF_WEEK.map((day, dayIndex) => {
                        const daySlots = TIME_TEMPLATES
                          .find(t => t.name === selectedTemplate)
                          ?.slots.filter(slot => slot.day_of_week === dayIndex) || [];
                        
                        if (daySlots.length === 0) return null;

                        return (
                          <div key={day} className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {day}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {daySlots.map((slot, index) => (
                                <div 
                                  key={index}
                                  className="text-xs bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    {' - '}
                                    {new Date(`2000-01-01T${slot.end_time}`).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                  {slot.buffer_minutes && slot.buffer_minutes > 0 && (
                                    <div className="text-gray-500 dark:text-gray-400 text-[10px]">
                                      +{slot.buffer_minutes}m buffer
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyTemplate}
                  disabled={!selectedTemplate}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 