'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { DateTime } from 'luxon';
import { getFingerprint } from '@/lib/fingerprint';
import Cookies from 'js-cookie';
import { StepIndicator } from './booking-form/StepIndicator';
import { BasicInfoForm } from './booking-form/BasicInfoForm';
import { ProjectDetailsForm } from './booking-form/ProjectDetailsForm';
import { ProjectDescriptionForm } from './booking-form/ProjectDescriptionForm';
import { NavigationButtons } from './booking-form/NavigationButtons';
import { ConfirmationModal } from './booking-form/ConfirmationModal';
import { SuccessView } from './booking-form/SuccessView';
import { RecentBookingView } from './booking-form/RecentBookingView';

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
  [key: string]: string;
}

const BOOKING_COOKIE_KEY = 'booking_completed';
const BOOKING_COOKIE_EXPIRY = 1;

type Step = 'basic' | 'project' | 'description' | 'review';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasRecentBooking, setHasRecentBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (Cookies.get(BOOKING_COOKIE_KEY)) {
      setHasRecentBooking(true);
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        console.log('Fetching services for embed:', embedId);
        const { data, error } = await supabase
          .from('booking_types')
          .select('*')
          .eq('embed_id', embedId)
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
          throw error;
        }
        
        console.log('Fetched services:', data);
        setServices(data || []);
      } catch (err) {
        console.error('Error in fetchServices:', err);
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (embedId) {
      fetchServices();
    }
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
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setError(null);
    setShowConfirmation(false);

    try {
      const fingerprint = await getFingerprint();

      if (fingerprint) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('fingerprint', fingerprint)
          .gte('created_at', DateTime.now().minus({ hours: 24 }).toISO());

        if (error) throw error;
        if (data?.length) throw new Error("You've already made a booking recently.");
      }

      const startTime = DateTime.fromFormat(selectedTime, 'HH:mm:ss');
      const endTime = startTime.plus({ minutes: 30 }).toFormat('HH:mm:ss');

      const { data: booking, error } = await supabase.from('bookings').insert({
        embed_id: embedId,
        date: selectedDate,
        start_time: selectedTime,
        end_time: endTime,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        notes: formData.notes,
        booking_type_id: formData.service,
        status: 'pending',
        fingerprint,
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
      }).select('id').single();

      if (error) throw error;

      Cookies.set(BOOKING_COOKIE_KEY, booking.id, { expires: BOOKING_COOKIE_EXPIRY });
      setHasRecentBooking(true);
      setSuccess(true);

      setTimeout(() => {
        window.location.href = `/bookings/${booking.id}`;
      }, 2000);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasRecentBooking) {
    return <RecentBookingView selectedDate={selectedDate} selectedTime={selectedTime} />;
  }

  if (success) {
    return <SuccessView selectedDate={selectedDate} selectedTime={selectedTime} />;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
      <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Schedule a Consultation</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Fields marked with * are required</p>
      
      <StepIndicator currentStep={currentStep} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 'basic' && (
          <BasicInfoForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            services={services}
            isLoadingServices={isLoadingServices}
          />
        )}
        {(currentStep === 'project') && (
          <ProjectDetailsForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        )}
        {currentStep === 'description' && (
          <ProjectDescriptionForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        )}

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm bg-red-50/50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200/50 dark:border-red-800/50">
            {error}
          </div>
        )}

        <NavigationButtons 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isSubmitting={isSubmitting}
        />
      </form>

      {showConfirmation && (
        <ConfirmationModal
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          formData={formData}
          isSubmitting={isSubmitting}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
} 