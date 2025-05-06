import { useState } from "react";
import { Embed } from "@/types/custom.types";
import { industries, getIndustryById } from "@/config/industries";

interface BookingSettingsProps {
  embed: Embed;
  isEditing: boolean;
  formData: Partial<Embed>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (name: string, value: boolean) => void;
}

export default function BookingSettings({
  embed,
  isEditing,
  formData,
  onInputChange,
  onCheckboxChange,
}: BookingSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const settings = embed.settings as {
    company_name?: string;
    industry?: string;
    timezone?: string;
    theme?: string;
    min_booking_notice_hours?: number;
    max_attendees?: number;
    archive_after_days?: number;
    allowed_booking_types?: string[];
    secure_booking?: boolean;
    custom_fields?: Record<string, string>;
  };

  const currentIndustry = getIndustryById(settings.industry || 'custom');
  const availableBookingTypes = currentIndustry?.availableBookingTypes || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Settings</h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 py-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="settings.company_name" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="settings.company_name"
                    name="settings.company_name"
                    value={formData.settings?.company_name || ''}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="settings.industry" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Industry
                  </label>
                  <select
                    id="settings.industry"
                    name="settings.industry"
                    value={formData.settings?.industry || 'custom'}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="settings.timezone" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Timezone
                  </label>
                  <select
                    id="settings.timezone"
                    name="settings.timezone"
                    value={formData.settings?.timezone || 'UTC'}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="settings.theme" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Theme
                  </label>
                  <select
                    id="settings.theme"
                    name="settings.theme"
                    value={formData.settings?.theme || 'light'}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="settings.min_booking_notice_hours" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Minimum Booking Notice (hours)
                  </label>
                  <input
                    type="number"
                    id="settings.min_booking_notice_hours"
                    name="settings.min_booking_notice_hours"
                    value={formData.settings?.min_booking_notice_hours || 24}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="settings.max_attendees" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    id="settings.max_attendees"
                    name="settings.max_attendees"
                    value={formData.settings?.max_attendees || 10}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="settings.archive_after_days" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Archive After (days)
                  </label>
                  <input
                    type="number"
                    id="settings.archive_after_days"
                    name="settings.archive_after_days"
                    value={formData.settings?.archive_after_days || 30}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Allowed Booking Types
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {availableBookingTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`booking-type-${type}`}
                          checked={formData.settings?.allowed_booking_types?.includes(type) || false}
                          onChange={(e) => onCheckboxChange(`settings.allowed_booking_types.${type}`, e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`booking-type-${type}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-white/80"
                        >
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="settings.secure_booking"
                    checked={formData.settings?.secure_booking || false}
                    onChange={(e) => onCheckboxChange('settings.secure_booking', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="settings.secure_booking"
                    className="ml-2 block text-sm text-gray-700 dark:text-white/80"
                  >
                    Require Authentication for Bookings
                  </label>
                </div>

                {currentIndustry?.customFields && currentIndustry.customFields.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {currentIndustry.name} Specific Fields
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentIndustry.customFields.map((field) => (
                        <div key={field.id}>
                          <label
                            htmlFor={`custom-field-${field.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-white/80"
                          >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              id={`custom-field-${field.id}`}
                              name={`settings.custom_fields.${field.id}`}
                              value={formData.settings?.custom_fields?.[field.id] || ''}
                              onChange={onInputChange}
                              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              id={`custom-field-${field.id}`}
                              name={`settings.custom_fields.${field.id}`}
                              value={formData.settings?.custom_fields?.[field.id] || ''}
                              onChange={onInputChange}
                              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={field.placeholder}
                              rows={3}
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={`custom-field-${field.id}`}
                              name={`settings.custom_fields.${field.id}`}
                              value={formData.settings?.custom_fields?.[field.id] || ''}
                              onChange={onInputChange}
                              className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Company Name</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.company_name || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Industry</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {currentIndustry?.name || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Timezone</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.timezone || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Theme</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.theme || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Minimum Booking Notice</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.min_booking_notice_hours || 24} hours
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Maximum Attendees</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.max_attendees || 10}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Archive After</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.archive_after_days || 30} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Allowed Booking Types</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.allowed_booking_types?.map(type => 
                    type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                  ).join(', ') || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Secure Booking</span>
                <span className="text-sm text-gray-900 dark:text-white/80">
                  {settings.secure_booking ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {currentIndustry?.customFields && currentIndustry.customFields.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {currentIndustry.name} Specific Fields
                  </h3>
                  <div className="space-y-4">
                    {currentIndustry.customFields.map((field) => (
                      <div key={field.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                          {field.label}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white/80">
                          {settings.custom_fields?.[field.id] || 'Not configured'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 