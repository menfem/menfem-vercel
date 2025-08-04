// ABOUTME: Admin article filtering component
// ABOUTME: Provides search and filtering controls for admin article management

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface AdminArticlesFiltersProps {
  currentSearch: string;
  currentPublished?: string;
  currentCategory?: string;
}

export function AdminArticlesFilters({
  currentSearch,
  currentPublished,
  currentCategory
}: AdminArticlesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      params.delete('page');
    }

    router.push(`/admin/articles?${params.toString()}`);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateSearchParams({ search: value || undefined });
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search articles by title, author, or content..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => updateSearchParams({ published: undefined })}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            !currentPublished 
              ? 'bg-brand-terracotta text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Articles
        </button>
        <button
          onClick={() => updateSearchParams({ published: 'true' })}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            currentPublished === 'true' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => updateSearchParams({ published: 'false' })}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            currentPublished === 'false' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Filter className="h-4 w-4 mr-1" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
        
        {/* Clear Filters */}
        {(currentSearch || currentPublished || currentCategory) && (
          <button
            onClick={() => {
              setSearch('');
              router.push('/admin/articles');
            }}
            className="text-sm text-brand-terracotta hover:text-brand-rust"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={currentCategory || ''}
                onChange={(e) => updateSearchParams({ category: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="culture">Culture</option>
                <option value="style">Style</option>
                <option value="health">Health</option>
                <option value="products">Products</option>
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="personal-development">Personal Development</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}