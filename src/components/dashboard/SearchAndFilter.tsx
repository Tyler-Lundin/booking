import { Search } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'name' | 'created_at';
  setSortBy: (sort: 'name' | 'created_at') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SearchAndFilterProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full sm:w-auto flex-grow group">
        <Search className="absolute left-3 top-1/2 transform z-50 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>
      <div className="flex gap-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'created_at')}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent shadow-sm transition-all duration-300 appearance-none cursor-pointer"
        >
          <option value="name">Name</option>
          <option value="created_at">Created Date</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 shadow-sm transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-lg">{sortOrder === 'asc' ? '↑' : '↓'}</span>
        </button>
      </div>
    </div>
  );
} 