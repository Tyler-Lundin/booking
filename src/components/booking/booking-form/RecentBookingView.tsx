import Cookies from 'js-cookie';

interface RecentBookingViewProps {
  selectedDate: string;
  selectedTime: string;
}

export function RecentBookingView({ selectedDate, selectedTime }: RecentBookingViewProps) {
  return (
    <div className="text-center space-y-4 p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50">
      <div className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 bg-clip-text text-transparent">✓</div>
      <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Booking Completed</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Thank you for your booking! You can create another booking after 24 hours.
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Date: {new Date(selectedDate).toLocaleDateString()}</p>
        <p>Time: {selectedTime}</p>
      </div>
      <div className="pt-4">
        <a
          href={`/bookings/${Cookies.get('booking_completed')}`}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105"
        >
          View Booking Details
        </a>
      </div>
    </div>
  );
} 