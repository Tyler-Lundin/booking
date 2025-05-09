'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupbaseAuth';
import { Lock, Globe, Bell, Shield, ArrowLeft } from 'lucide-react';
import { FoxHead } from '@/components/Logo';

export default function SettingsPage() {
  const router = useRouter();
  const { loading, error, supabase } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (error) router.push('/auth');
  }, [error, router]);

  const loadingSkeleton = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-white/80">Loading...</p>
      </div>
    </div>
  );

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password updated successfully' });
      e.currentTarget.reset();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get('newEmail') as string;

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Verification email sent to new address' });
      e.currentTarget.reset();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update email' });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return loadingSkeleton;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Settings</span>
          </div>
          <FoxHead />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {message && (
          <div
            className={`mb-6 p-4 rounded-md font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Auth Settings */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 space-y-8">
            <header className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Authentication</h2>
            </header>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                name="newPassword"
                type="password"
                placeholder="New password"
                required
                className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <form onSubmit={handleEmailChange} className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <input
                name="newEmail"
                type="email"
                placeholder="New email address"
                required
                className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Email'}
              </button>
            </form>
          </section>

          {/* Site Settings */}
          <section className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 space-y-6">
            <header className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Site Preferences</h2>
            </header>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
              <select
                defaultValue="system"
                className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">Notifications</h3>

              {[{
                label: 'Email Notifications',
                icon: <Bell className="w-5 h-5 text-gray-500 mr-2" />
              }, {
                label: 'Security Alerts',
                icon: <Shield className="w-5 h-5 text-gray-500 mr-2" />
              }].map(({ label, icon }, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    {icon}
                    {label}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}