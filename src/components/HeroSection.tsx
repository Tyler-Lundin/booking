import Link from 'next/link';
import { FoxHead } from './Logo';

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-900 dark:to-black min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent dark:from-orange-500/20 animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-32 sm:py-48 lg:py-56 relative">
        <div className="text-center flex flex-col items-center justify-center">
          {/* Animated logo */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <FoxHead size="w-40 h-40" className="transform transition-transform duration-500 group-hover:scale-105" />
            </div>
          </div>

          {/* Title with gradient text */}
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-600 animate-gradient">
            FOXLOT <br/>
            <span className="text-gray-900 dark:text-white">BOOKING</span>
          </h1>

          {/* Animated description */}
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 animate-fade-in">
            Streamline your scheduling with AI-powered booking
          </p>

          {/* CTA Button with hover effects */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth"
              className="group relative px-8 py-3 text-sm font-semibold text-black transition-all duration-300 ease-out hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-1 -translate-y-1 bg-orange-400 group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full bg-orange-500 border-2 border-black group-hover:bg-orange-400"></span>
              <span className="relative flex items-center justify-center">
                Get started
                <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Creator link with hover effect */}
          <Link 
            href="https://tylerlundin.me" 
            className="mt-8 text-sm text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 group"
          >
            <span className="relative">
              Creator
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 dark:bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 
