'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmbedDashboard } from '@/hooks/useEmbedDashboard';
import { X } from 'lucide-react';
import EmbedIframe from '@/components/EmbedIframe';

export default function EmbedPreviewPage() {
  const router = useRouter();
  const { id: embedId } = useParams();
  const { embed, loading, error } = useEmbedDashboard({ embedId: embedId as string });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-white/80">Loading embed preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Error</h1>
          <p className="mt-2 text-gray-600 dark:text-white/80">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!embed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Embed not found</h1>
          <p className="mt-2 text-gray-600 dark:text-white/80">The embed you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full h-full sm:h-[80vh] sm:max-w-4xl flex flex-col">
            <div className="flex items-center justify-between p-2 sm:p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview: {embed.settings.company_name || embed.name}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  router.push('/dashboard');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <EmbedIframe id={embedId as string} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
