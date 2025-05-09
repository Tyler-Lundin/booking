interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  [key: string]: string;
}

interface ConfirmationModalProps {
  selectedDate: string;
  selectedTime: string;
  formData: FormData;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({
  selectedDate,
  selectedTime,
  formData,
  isSubmitting,
  onClose,
  onConfirm
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-white/75 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200/50 dark:border-gray-800/50">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Confirm Your Booking</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> {selectedTime}</li>
          <li><strong>Name:</strong> {formData.name}</li>
          {formData.email && <li><strong>Email:</strong> {formData.email}</li>}
          {formData.phone && <li><strong>Phone:</strong> {formData.phone}</li>}
          {formData.notes && <li><strong>Notes:</strong> {formData.notes}</li>}
        </ul>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
} 