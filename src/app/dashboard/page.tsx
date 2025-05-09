'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SearchAndFilter } from '@/components/dashboard/SearchAndFilter';
import { NavigationTabs } from '@/components/dashboard/NavigationTabs';
import { CreateNewEmbedCard, EmbedCard } from '@/components/dashboard/EmbedCard';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';

export default function DashboardPage() {
  const {
    loading,
    embeds,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    activeTab,
    setActiveTab,
    copyEmbedCode,
  } = useDashboard();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {embeds.map((embed) => (
            <EmbedCard key={embed.id} embed={embed} copyEmbedCode={copyEmbedCode} />
          ))}
            <CreateNewEmbedCard />
          </section>
        </main>
      </div>
    );
  }
