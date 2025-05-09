type TabType = 'projects' | 'bookings' | 'appointments' | 'availability';

interface NavigationTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function NavigationTabs({ activeTab, setActiveTab }: NavigationTabsProps) {
  const tabs: TabType[] = ['projects', 'bookings', 'appointments', 'availability'];

  return (
    <div className="mb-8">
      <nav className="relative flex space-x-8 overflow-x-auto p-1 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-orange-500 dark:to-pink-500 rounded-xl transition-all duration-300" />
            )}
            <span className="relative z-10">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
} 