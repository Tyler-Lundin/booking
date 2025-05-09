'use client';

import React, { useState } from 'react';
import { Database } from '@/types/database.types';

type Embed = Database['public']['Tables']['embeds']['Row'];

interface BookingsHeaderProps {
  embed: Embed;
  isEditing: boolean;
  formData: Partial<Embed>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function BookingsHeader({
  embed,
  isEditing,
  formData,
  onInputChange,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: BookingsHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeUrl = `${window.location.origin}/embed/${embed.id}/iframe`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(iframeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={onInputChange}
                className="block w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 p-0"
                placeholder="Enter embed name"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {embed.name}
              </h1>
            )}
            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-white/80">
                Embed ID: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">{embed.id}</code>
              </p>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label="Actions"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-white/80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            onEdit();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Settings
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this embed?')) {
                              onDelete();
                            }
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                          role="menuitem"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Embed
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onSave();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-green-700 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900"
                          role="menuitem"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            onCancel();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-gray-800"
                          role="menuitem"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
