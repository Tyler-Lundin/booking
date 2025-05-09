import { useState } from "react";
import { FormData } from './CreateEmbed';

interface BasicInformationProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function BasicInformation({ formData, onInputChange }: BasicInformationProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
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
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                Embed Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name || ''}
                onChange={onInputChange}
                required
                className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter a name for your embed"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-white/60">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      )}
    </div>
  );
} 