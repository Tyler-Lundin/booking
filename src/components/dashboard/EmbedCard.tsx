"use client"
import { Calendar, Clock, Code, Plus, Settings, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EmbedCardProps {
  embed: {
    id: string;
    name: string;
    created_at: string;
    settings: {
      company_name?: string;
      min_booking_notice_hours?: number;
    };
  };
  copyEmbedCode: (id: string) => void;
}

export function EmbedCard({ embed, copyEmbedCode }: EmbedCardProps) {
  const router = useRouter();

  return (
    <div className="group bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500/20 dark:hover:border-orange-500/20">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
              {embed.settings.company_name || embed.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all mt-1">ID: {embed.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => copyEmbedCode(embed.id)}
              className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-orange-500 transition-colors duration-300 transform hover:scale-110"
              title="Copy embed code"
            >
              <Code size={18} />
            </button>
            <button
              onClick={() => router.push(`/embed/${embed.id}/settings`)}
              className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-orange-500 transition-colors duration-300 transform hover:scale-110"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        <ul className="space-y-3 text-sm">
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Users size={16} className="mr-3 text-blue-500 dark:text-orange-500" /> Admin Access
          </li>
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar size={16} className="mr-3 text-blue-500 dark:text-orange-500" /> Created {new Date(embed.created_at).toLocaleDateString()}
          </li>
          <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock size={16} className="mr-3 text-blue-500 dark:text-orange-500" /> Min Notice: {embed.settings.min_booking_notice_hours || 24}h
          </li>
        </ul>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => router.push(`/embed/${embed.id}`)}
          className="flex-1 hover:blur-[1px] relative group bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Preview</span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-pink-500 dark:to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
        <button
          onClick={() => router.push(`/embed/${embed.id}/bookings`)}
          className="flex-1 hover:blur-[1px]  bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-900/50 dark:border-gray-600/50 hover:border-blue-500/20 dark:hover:border-orange-500/20 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300"
        >
          Bookings
        </button>
      </div>
    </div>
  );
}

export function CreateNewEmbedCard() {
  return (
    <div className="grid group justify-center overflow-hidden relative items-center w-full h-full border border-gray-900/50 dark:border-gray-500/50 hover:border-blue-500/20 dark:hover:border-orange-500/20 rounded-2xl ">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-pink-500 dark:to-orange-500 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-15 transition-all duration-300" />
      <h3 className="text-center text-gray-900 dark:text-gray-100 text-lg font-thin absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">Create New Embed</h3>

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 dark:from-pink-500 dark:to-orange-500 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-15 transition-all duration-300" />
          <Plus size={64} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-gray-100" />
    </div>
  );
}
