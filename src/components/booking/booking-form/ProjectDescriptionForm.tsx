interface FormData {
  projectDescription: string;
  technicalRequirements: string;
  preferredTechStack: string;
  [key: string]: string;
}

interface ProjectDescriptionFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function ProjectDescriptionForm({ formData, handleInputChange }: ProjectDescriptionFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          required
          rows={4}
          value={formData.projectDescription}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
          placeholder="Please describe your project in detail"
        />
      </div>

      <div>
        <label htmlFor="technicalRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Technical Requirements <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
        </label>
        <textarea
          id="technicalRequirements"
          name="technicalRequirements"
          rows={3}
          value={formData.technicalRequirements}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
          placeholder="Any specific technical requirements or constraints?"
        />
      </div>

      <div>
        <label htmlFor="preferredTechStack" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Tech Stack <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
        </label>
        <input
          type="text"
          id="preferredTechStack"
          name="preferredTechStack"
          value={formData.preferredTechStack}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
          placeholder="Any preferred technologies or frameworks?"
        />
      </div>
    </div>
  );
} 