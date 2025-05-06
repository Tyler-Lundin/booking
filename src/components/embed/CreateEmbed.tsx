"use client";

import { Database } from "@/types/database.types";
import { useSupabaseAuth } from "@/hooks/useSupbaseAuth";
import { useCreateEmbed } from "./useCreateEmbed";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import BasicInformation from "./BasicInformation";
import BookingSettings from "./BookingSettings";
import SupabaseSettings from "./SupabaseSettings";
import { Embed, EmbedSettings, IndustryType } from "@/types/booking.types";

interface FormData {
  name: string;
  settings: Record<string, any>;
  supabase_project_id: string;
  supabase_url: string;
  supabase_api_key: string;
  supabase_service_role_key: string;
  supabase_database_url: string;
  supabase_database_name: string;
}

const adjectives = ['Swift', 'Bright', 'Quick', 'Smart', 'Clear', 'Fresh', 'Sharp', 'Bold', 'Calm', 'Cool'];
const nouns = ['Fox', 'Wolf', 'Eagle', 'Hawk', 'Lion', 'Bear', 'Deer', 'Owl', 'Hare', 'Lynx'];

function generateRandomName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun} Booking`;
}

export default function CreateEmbed() {
  const { user, loading: authLoading, error: authError } = useSupabaseAuth();
  const { createEmbed, isLoading, error } = useCreateEmbed();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    settings: {
      industry: 'custom',
      theme: 'light',
      min_booking_notice_hours: 24,
      max_attendees: 1,
      archive_after_days: 30,
      allowed_booking_types: [],
      secure_booking: false,
      custom_fields: {}
    },
    supabase_project_id: '',
    supabase_url: '',
    supabase_api_key: '',
    supabase_service_role_key: '',
    supabase_database_url: '',
    supabase_database_name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      if (settingName === 'allowed_booking_types') {
        const type = name.split('.')[2];
        setFormData(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            allowed_booking_types: checked
              ? [...(prev.settings.allowed_booking_types || []), type]
              : (prev.settings.allowed_booking_types || []).filter((t: string) => t !== type)
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            [settingName]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found');
      return;
    }

    const embedData: Embed = {
      id: uuidv4(),
      name: formData.name,
      settings: formData.settings as EmbedSettings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: user.id,
      admin_ids: [],
      supabase_project_id: formData.supabase_project_id,
      supabase_url: formData.supabase_url,
      supabase_api_key: formData.supabase_api_key,
      supabase_service_role_key: formData.supabase_service_role_key,
      supabase_database_url: formData.supabase_database_url,
      supabase_database_name: formData.supabase_database_name,
      industry: formData.settings.industry || 'custom',
      theme: formData.settings.theme || 'light',
      timezone: 'UTC'
    };
    await createEmbed(embedData);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Embed</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInformation
            formData={formData}
            onInputChange={handleInputChange}
          />

          <BookingSettings
            embed={formData as any}
            isEditing={true}
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
          />


<SupabaseSettings
            embed={formData as any}
            isEditing={true}
            formData={formData}
            onInputChange={handleInputChange}
          />


          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Embed'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg fixed bottom-0 right-0 m-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 