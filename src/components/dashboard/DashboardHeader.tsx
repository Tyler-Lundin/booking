import { FoxHead } from '@/components/Logo';
import UserButton from '@/components/auth/UserButton';

export function DashboardHeader() {

  return (
    <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-950/70 shadow-lg sticky top-0 z-10 border-b border-gray-200/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <FoxHead />
          </div>
          <h1 className="hidden select-none sm:block font-bold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
} 