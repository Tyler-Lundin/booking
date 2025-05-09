import { ChevronLeft, ChevronRight } from 'lucide-react';

type Step = 'basic' | 'project' | 'description' | 'review';

interface NavigationButtonsProps {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  isSubmitting: boolean;
}

export function NavigationButtons({ currentStep, setCurrentStep, isSubmitting }: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-6">
      {currentStep !== 'basic' && (
        <button
          type="button"
          onClick={() => {
            if (currentStep === 'project') setCurrentStep('basic');
            else if (currentStep === 'description') setCurrentStep('project');
            else if (currentStep === 'review') setCurrentStep('description');
          }}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      )}
      <div className="flex-1" />
      {currentStep !== 'review' ? (
        <button
          type="button"
          onClick={() => {
            if (currentStep === 'basic') setCurrentStep('project');
            else if (currentStep === 'project') setCurrentStep('description');
            else if (currentStep === 'description') setCurrentStep('review');
          }}
          className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
        </button>
      )}
    </div>
  );
} 