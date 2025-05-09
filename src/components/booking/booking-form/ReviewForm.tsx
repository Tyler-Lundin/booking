import { Database } from '@/types/database.types';

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
  [key: string]: string;
}

interface ReviewFormProps {
  formData: FormData;
  services: Database['public']['Tables']['booking_types']['Row'][];
  selectedDate: string;
  selectedTime: string;
}

export function ReviewForm({ formData, services, selectedDate, selectedTime }: ReviewFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Time Slot</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
          <p>Time: {selectedTime}</p>
        </div>
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Basic Information</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p><span className="font-medium">Name:</span> {formData.name}</p>
          <p><span className="font-medium">Email:</span> {formData.email}</p>
          <p><span className="font-medium">Phone:</span> {formData.phone}</p>
          <p><span className="font-medium">Service:</span> {services.find(s => s.id === formData.service)?.name}</p>
        </div>
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Details</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p><span className="font-medium">Type:</span> {formData.projectType}</p>
          <p><span className="font-medium">Budget:</span> {formData.budget}</p>
          <p><span className="font-medium">Timeline:</span> {formData.timeline}</p>
        </div>
      </div>

      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Description</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p><span className="font-medium">Description:</span></p>
          <p className="whitespace-pre-wrap">{formData.projectDescription}</p>
          {formData.technicalRequirements && (
            <>
              <p><span className="font-medium">Technical Requirements:</span></p>
              <p className="whitespace-pre-wrap">{formData.technicalRequirements}</p>
            </>
          )}
          {formData.preferredTechStack && (
            <>
              <p><span className="font-medium">Preferred Tech Stack:</span></p>
              <p>{formData.preferredTechStack}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 