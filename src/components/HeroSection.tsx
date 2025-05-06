import Link from 'next/link';
import { FoxHead, FoxTail } from './Logo';

export default function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 h-screen">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        
        <div className="text-center flex flex-col items-center justify-center w-min justify-self-center">
          <FoxHead size="w-40 h-40" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            SLOTFOX <br/>
            BOOKING
          </h1>
            <Link
              href="/auth"
              className="rounded-md w-full bg-orange-400 mt-4 px-3.5 py-2.5 text-sm font-bold text-black shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
          <Link href="https://tylerlundin.me" className="text-xs my-4 text-gray-600 hover:text-gray-900 underline dark:text-white/80 dark:hover:text-white/50">Creator</Link>

        </div>
      </div>
    </div>
  );
} 
