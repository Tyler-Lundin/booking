'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

interface TattooBookingFormProps {
  selectedDate: string;
  selectedTime: string;
  embedId: string;
}

export default function TattooBookingForm({ 
  selectedDate, 
  selectedTime, 
  embedId 
}: TattooBookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    designDescription: '',
    placement: '',
    size: '',
    referenceImages: '',
    allergies: '',
    medicalConditions: '',
    notes: ''
  });
  const [services] = useState<Database['public']['Tables']['booking_types']['Row'][]>([]);
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('bookings').insert({
        embed_id: embedId,
        date: selectedDate,
        start_time: selectedTime,
        end_time: selectedTime,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        notes: formData.notes,
        appointment_type_id: formData.service,
        status: 'pending',
        metadata: {
          designDescription: formData.designDescription,
          placement: formData.placement,
          size: formData.size,
          referenceImages: formData.referenceImages,
          allergies: formData.allergies,
          medicalConditions: formData.medicalConditions
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Your Tattoo Session</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700">
            Service
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="designDescription" className="block text-sm font-medium text-gray-700">
            Design Description
          </label>
          <textarea
            id="designDescription"
            name="designDescription"
            required
            rows={3}
            value={formData.designDescription}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your tattoo design in detail"
          />
        </div>

        <div>
          <label htmlFor="placement" className="block text-sm font-medium text-gray-700">
            Placement
          </label>
          <input
            type="text"
            id="placement"
            name="placement"
            required
            value={formData.placement}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Where on your body would you like the tattoo?"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
            Size (in inches)
          </label>
          <input
            type="text"
            id="size"
            name="size"
            required
            value={formData.size}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Approximate size of the tattoo"
          />
        </div>

        <div>
          <label htmlFor="referenceImages" className="block text-sm font-medium text-gray-700">
            Reference Images (URLs)
          </label>
          <textarea
            id="referenceImages"
            name="referenceImages"
            rows={2}
            value={formData.referenceImages}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Links to reference images (one per line)"
          />
        </div>

        <div>
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
            Allergies
          </label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List any allergies (if none, leave blank)"
          />
        </div>

        <div>
          <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">
            Medical Conditions
          </label>
          <input
            type="text"
            id="medicalConditions"
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List any medical conditions (if none, leave blank)"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Any other information we should know?"
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
          <p>Time: {selectedTime}</p>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
} 