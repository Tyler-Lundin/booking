interface SuccessViewProps {
  selectedDate: string;
  selectedTime: string;
}

export function SuccessView({ selectedDate, selectedTime }: SuccessViewProps) {
  return (
    <div className="text-center space-y-4 p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50">
      <div className="text-5xl mb-4 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-pink-500 dark:to-orange-500 bg-clip-text text-transparent">✓</div>
      <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Booking Confirmed!</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Your booking has been created successfully. Redirecting to booking details...
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
        <p>Time: {selectedTime}</p>
      </div>
    </div>
  );
} 