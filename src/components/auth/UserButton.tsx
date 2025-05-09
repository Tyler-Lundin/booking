'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupbaseAuth';
import { User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type UserWithMetadata = {
  created_at: string;
  email: string;
  full_name: string | null;
  id: string;
  role: string | null;
  updated_at: string;
  user_metadata?: {
    avatar_url?: string;
  };
};

export default function UserButton() {
  const { user, supabase } = useSupabaseAuth();
  const typedUser = user as UserWithMetadata | null;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 transition-all duration-300",
          "hover:scale-105 focus:outline-none",
          "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        )}
      >
        <div className={cn(
          "w-9 h-9 rounded-full",
          "bg-white/10 dark:bg-gray-800/50",
          "backdrop-blur-md",
          "border-2 border-emerald-500/50 dark:border-emerald-500/50",
          "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/20",
          "flex items-center justify-center overflow-hidden",
          "transition-all duration-300",
          "hover:border-emerald-500 dark:hover:border-emerald-500",
          "hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/30"
        )}>
          {typedUser ? (
            typedUser.user_metadata?.avatar_url ? (
              <Image
                src={typedUser.user_metadata.avatar_url}
                alt={typedUser.email || 'User'}
                className="w-full h-full object-cover"
                width={36}
                height={36}
              />
            ) : (
              <User className="w-5 h-5 text-emerald-500" />
            )
          ) : (
            <div className="w-full h-full animate-pulse bg-emerald-500/20 rounded-full" />
          )}
        </div>
      </button>

      {user && isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-56",
          "rounded-xl",
          "bg-white dark:bg-gray-900",
          "backdrop-blur-md",
          "border border-gray-200/50 dark:border-gray-700/50",
          "shadow-xl shadow-emerald-500/10 dark:shadow-emerald-500/10",
          "transform transition-all duration-300",
          "animate-in fade-in slide-in-from-top-2 z-[500]"
        )}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-3 text-sm border-b border-gray-200/50 dark:border-gray-700/50">
              <p className="font-medium truncate bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center w-full px-4 py-2.5 text-sm",
                "text-gray-700 dark:text-gray-300",
                "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20",
                "transition-colors duration-200"
              )}
              role="menuitem"
            >
              <Settings className="w-4 h-4 mr-2 text-emerald-500" />
              Settings
            </button>

            <button
              onClick={handleSignOut}
              className={cn(
                "flex items-center w-full px-4 py-2.5 text-sm",
                "text-red-600 dark:text-red-400",
                "hover:bg-red-500/10 dark:hover:bg-red-500/20",
                "transition-colors duration-200"
              )}
              role="menuitem"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}