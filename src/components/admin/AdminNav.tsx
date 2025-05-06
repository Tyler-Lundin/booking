'use client';

import { useState } from 'react';
import { LogoFull, FoxHead } from '@/components/Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Bookings', href: '/admin/bookings' },
  { name: 'Availability', href: '/admin/availability' },
  { name: 'Configuration', href: '/admin/config' },
];

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white/80 backdrop-blur border shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6 text-gray-700" /> : <Bars3Icon className="h-6 w-6 text-gray-700" />}
        </button>
      </div>

      <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 lg:hidden"
    >
      {/* Clickable dark overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl p-4 flex flex-col z-10"
      >
        <div className="flex items-center mb-4">
          <FoxHead size="w-8 h-8" />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                pathname === href
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b">
          <LogoFull />
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {NAV_LINKS.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === href
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
