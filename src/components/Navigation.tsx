'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoFull } from './Logo';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Availability', href: '/availability' },
    { name: 'Bookings', href: '/bookings' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <LogoFull />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-indigo-500 text-gray-900 blur-[2px]'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <span className="text-sm text-gray-500">
                Signed in as {user.email}
              </span>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 