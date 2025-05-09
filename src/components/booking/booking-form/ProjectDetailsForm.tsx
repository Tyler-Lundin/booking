interface FormData {
  projectType: string;
  budget: string;
  timeline: string;
  [key: string]: string;
}

interface ProjectDetailsFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function ProjectDetailsForm({ formData, handleInputChange }: ProjectDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Type <span className="text-red-500">*</span>
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          value={formData.projectType}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
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
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="budget"
          name="budget"
          required
          value={formData.budget}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
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
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Timeline <span className="text-red-500">*</span>
        </label>
        <select
          id="timeline"
          name="timeline"
          required
          value={formData.timeline}
          onChange={handleInputChange}
          className="mt-1 block w-full p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-orange-500/20 transition-all duration-300"
        >
          <option value="">Select timeline</option>
          <option value="1-2-weeks">1-2 weeks</option>
          <option value="2-4-weeks">2-4 weeks</option>
          <option value="1-2-months">1-2 months</option>
          <option value="2-4-months">2-4 months</option>
          <option value="4-plus-months">4+ months</option>
        </select>
      </div>
    </div>
  );
} 