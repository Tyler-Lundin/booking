export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-800/50">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl w-1/2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl w-2/3"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl w-1/3"></div>
              </div>
              <div className="mt-6 flex space-x-3">
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl flex-1"></div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 