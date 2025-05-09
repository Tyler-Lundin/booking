import { cn } from '@/lib/utils';

type Step = 'basic' | 'project' | 'description' | 'review';

interface StepIndicatorProps {
  currentStep: Step;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'project', label: 'Project Details' },
    { id: 'description', label: 'Description' },
    { id: 'review', label: 'Review' }
  ];

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
              currentStep === step.id
                ? "bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}
          >
            {index + 1}
          </div>
          <span className={cn(
            "ml-2 text-sm font-medium",
            currentStep === step.id
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          )}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 mx-4 bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
} 