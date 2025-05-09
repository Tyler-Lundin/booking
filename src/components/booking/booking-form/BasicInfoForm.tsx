import { Database } from '@/types/database.types';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  [key: string]: string;
}

interface BasicInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  services: Database['public']['Tables']['booking_types']['Row'][];
  isLoadingServices: boolean;
}

export function BasicInfoForm({ 
  formData, 
  handleInputChange, 
  services, 
  isLoadingServices 
}: BasicInfoFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Service <span className="text-red-500">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          value={formData.service}
          onChange={handleInputChange}
          disabled={isLoadingServices}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{isLoadingServices ? 'Loading services...' : 'Select a service'}</option>
          {!isLoadingServices && services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name} {service.price ? `- $${service.price}` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 