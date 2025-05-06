'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupbaseAuth';
import { Embed, } from '@/types/custom.types';
import { Search, Calendar, Settings, Users, Clock, Code } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, error, supabase } = useSupabaseAuth();
  const router = useRouter();
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [loadingEmbeds, setLoadingEmbeds] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'embeds' | 'bookings' | 'appointments' | 'availability'>('embeds');

  useEffect(() => {
    if (error) router.push('/auth');
  }, [error, router]);

  useEffect(() => {
    const fetchEmbeds = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .or(`owner_id.eq.${user.id},admin_ids.cs.{${user.id}}`);

      if (error) {
        console.error(error);
        return;
      }

      if (!data || data.length === 0) {
        router.push('/embed/create');
        return;
      }

      setEmbeds(data);
      setLoadingEmbeds(false);
    };

    fetchEmbeds();
  }, [user, supabase, router]);

  const filteredAndSortedEmbeds = useMemo(() => {
    return embeds
      .filter(embed => 
        embed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        embed.settings.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' 
            ? (a.settings.company_name || a.name).localeCompare(b.settings.company_name || b.name)
            : (b.settings.company_name || b.name).localeCompare(a.settings.company_name || a.name);
        } else {
          return sortOrder === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [embeds, searchQuery, sortBy, sortOrder]);

  if (loading || loadingEmbeds) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => router.push('/embed/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Embed
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search embeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'created_at')}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="created_at">Created Date</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('embeds')}
              className={`${
                activeTab === 'embeds'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Embeds
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Appointment Types
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`${
                activeTab === 'availability'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Availability
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEmbeds.map((embed) => (
            <div
              key={embed.id}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {embed.settings.company_name || embed.name}
                  </h2>
                  <p className="text-sm text-gray-500">ID: {embed.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const embedCode = `<iframe src="${window.location.origin}/embed/${embed.id}/iframe" width="100%" height="600" frameborder="0"></iframe>`;
                      navigator.clipboard.writeText(embedCode);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy embed code"
                  >
                    <Code size={20} />
                  </button>
                  <button
                    onClick={() => router.push(`/embed/${embed.id}/settings`)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-2" />
                  <span>Admin Access</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  <span>Created {new Date(embed.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2" />
                  <span>Min Notice: {embed.settings.min_booking_notice_hours || 24}h</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => router.push(`/embed/${embed.id}`)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  View Embed
                </button>
                <button
                  onClick={() => router.push(`/embed/${embed.id}/bookings`)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Bookings
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
