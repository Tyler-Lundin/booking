import { useState } from "react";
import { Embed } from "@/types/custom.types";
interface SupabaseSettingsProps {
  embed: Embed;
  isEditing: boolean;
  formData: Partial<Embed>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function SupabaseSettings({
  embed,
  isEditing,
  formData,
  onInputChange,
}: SupabaseSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Supabase Connection</h2>
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
                  <label htmlFor="supabase_project_id" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Project ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="supabase_project_id"
                    name="supabase_project_id"
                    value={formData.supabase_project_id || ''}
                    onChange={onInputChange}
                    required
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your Supabase project ID"
                  />
                </div>
                <div>
                  <label htmlFor="supabase_url" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    Supabase URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="supabase_url"
                    name="supabase_url"
                    value={formData.supabase_url || ''}
                    onChange={onInputChange}
                    required
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your Supabase URL"
                  />
                </div>
                <div>
                  <label htmlFor="supabase_api_key" className="block text-sm font-medium text-gray-700 dark:text-white/80">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="supabase_api_key"
                    name="supabase_api_key"
                    value={formData.supabase_api_key || ''}
                    onChange={onInputChange}
                    required
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your API key"
                  />
                </div>
                <div>
                  <label htmlFor="supabase_service_role_key" className="block text-sm font-medium text-gray-500 dark:text-white/60">
                    Service Role Key (Optional)
                  </label>
                  <input
                    type="password"
                    id="supabase_service_role_key"
                    name="supabase_service_role_key"
                    value={formData.supabase_service_role_key || ''}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your service role key"
                  />
                </div>
                <div>
                  <label htmlFor="supabase_database_url" className="block text-sm font-medium text-gray-500 dark:text-white/60">
                    Database URL (Optional)
                  </label>
                  <input
                    type="text"
                    id="supabase_database_url"
                    name="supabase_database_url"
                    value={formData.supabase_database_url || ''}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your database URL"
                  />
                </div>
                <div>
                  <label htmlFor="supabase_database_name" className="block text-sm font-medium text-gray-500 dark:text-white/60">
                    Database Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="supabase_database_name"
                    name="supabase_database_name"
                    value={formData.supabase_database_name || ''}
                    onChange={onInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your database name"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-white/60">
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">Project ID</span>
                <span className="text-sm text-gray-900 dark:text-white/80 font-mono bg-gray-100 px-2 py-1 rounded">
                  {embed.supabase_project_id || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">URL</span>
                <span className="text-sm text-gray-900 dark:text-white/80 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                  {embed.supabase_url || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">API Key</span>
                <span className="text-sm text-gray-900 dark:text-white/80 font-mono bg-gray-100 px-2 py-1 rounded">
                  {embed.supabase_api_key ? '••••••••' : 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-white/60">Service Role Key</span>
                <span className="text-sm text-gray-900 dark:text-white/80 font-mono bg-gray-100 px-2 py-1 rounded">
                  {embed.supabase_service_role_key ? '••••••••' : 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-white/60">Database URL</span>
                <span className="text-sm text-gray-900 dark:text-white/80 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                  {embed.supabase_database_url || 'Not configured'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-white/60">Database Name</span>
                <span className="text-sm text-gray-900 dark:text-white/80 font-mono bg-gray-100 px-2 py-1 rounded">
                  {embed.supabase_database_name || 'Not configured'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 