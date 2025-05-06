'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import BaseBookingForm from './BaseBookingForm';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface CustomBookingFormProps {
  selectedDate: string;
  selectedTime: string;
  embedId: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
  technicalRequirements: string;
  preferredTechStack: string;
  notes: string;
  [key: string]: string; // Allow for custom fields
}

export default function CustomBookingForm({ 
  selectedDate, 
  selectedTime, 
  embedId 
}: CustomBookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    projectType: '',
    budget: '',
    timeline: '',
    projectDescription: '',
    technicalRequirements: '',
    preferredTechStack: '',
    notes: ''
  });
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [services, setServices] = useState<Database['public']['Tables']['booking_types']['Row'][]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const { data, error } = await supabase
          .from('booking_types')
          .select('*')
          .eq('embed_id', embedId)
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, [embedId, supabase]);

  useEffect(() => {
    const fetchEmbedSettings = async () => {
      const { data: embed } = await supabase
        .from('embeds')
        .select('settings')
        .eq('id', embedId)
        .single();

      if (embed?.settings && typeof embed.settings === 'object' && 'custom_fields' in embed.settings) {
        const settings = embed.settings as { custom_fields?: Record<string, CustomField> };
        if (settings.custom_fields) {
          setCustomFields(Object.entries(settings.custom_fields).map(([id, field]) => ({
            ...field,
            id
          })));
        }
      }
    };

    fetchEmbedSettings();
  }, [embedId, supabase]);

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
          projectType: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          projectDescription: formData.projectDescription,
          technicalRequirements: formData.technicalRequirements,
          preferredTechStack: formData.preferredTechStack,
          ...customFields.reduce((acc, field) => ({
            ...acc,
            [field.id]: formData[field.id] || ''
          }), {})
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
      <h2 className="text-2xl font-bold mb-6 text-center">Schedule a Consultation</h2>
      
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
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            value={formData.projectType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select project type</option>
            <option value="website">Website</option>
            <option value="web-app">Web Application</option>
            <option value="mobile-app">Mobile Application</option>
            <option value="ecommerce">E-commerce</option>
            <option value="api">API Development</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            required
            value={formData.budget}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select budget range</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-plus">$25,000+</option>
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
            Project Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            value={formData.timeline}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select timeline</option>
            <option value="1-2-weeks">1-2 weeks</option>
            <option value="2-4-weeks">2-4 weeks</option>
            <option value="1-2-months">1-2 months</option>
            <option value="2-4-months">2-4 months</option>
            <option value="4-plus-months">4+ months</option>
          </select>
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
            Project Description
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            required
            rows={4}
            value={formData.projectDescription}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Please describe your project in detail"
          />
        </div>

        <div>
          <label htmlFor="technicalRequirements" className="block text-sm font-medium text-gray-700">
            Technical Requirements
          </label>
          <textarea
            id="technicalRequirements"
            name="technicalRequirements"
            rows={3}
            value={formData.technicalRequirements}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Any specific technical requirements or constraints?"
          />
        </div>

        <div>
          <label htmlFor="preferredTechStack" className="block text-sm font-medium text-gray-700">
            Preferred Tech Stack
          </label>
          <input
            type="text"
            id="preferredTechStack"
            name="preferredTechStack"
            value={formData.preferredTechStack}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Any preferred technologies or frameworks?"
          />
        </div>

        {customFields.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                required={field.required}
                rows={3}
                value={formData[field.id] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                required={field.required}
                value={formData[field.id] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select an option</option>
                {field.options?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                required={field.required}
                value={formData[field.id] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

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
          Book Consultation
        </button>
      </form>
    </div>
  );
} 