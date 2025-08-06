// ABOUTME: Article filtering component with search, category, and sorting options
// ABOUTME: Uses URL state management for filter persistence and sharing

'use client';

import { useState } from 'react';
import { useQueryStates } from 'nuqs';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { parseAsString } from 'nuqs';

// No props needed for this component

export function ArticleFilters() {
  const [{ search, category, sortBy, sortOrder }, setFilters] = useQueryStates({
    search: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
    sortBy: parseAsString.withDefault('publishedAt'),
    sortOrder: parseAsString.withDefault('desc'),
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={(value) => setFilters({ search: value })}
          placeholder="Search articles..."
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Button
          variant={category === '' ? 'default' : 'outline'}
          onClick={() => setFilters({ category: '' })}
          className="text-sm"
        >
          All Categories
        </Button>
        <Button
          variant={category === 'culture' ? 'default' : 'outline'}
          onClick={() => setFilters({ category: 'culture' })}
          className="text-sm"
        >
          Culture
        </Button>
        <Button
          variant={category === 'style' ? 'default' : 'outline'}  
          onClick={() => setFilters({ category: 'style' })}
          className="text-sm"
        >
          Style
        </Button>
        <Button
          variant={category === 'personal-development' ? 'default' : 'outline'}  
          onClick={() => setFilters({ category: 'personal-development' })}
          className="text-sm"
        >
          Personal Development
        </Button>
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="ghost"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-brand-brown"
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('_');
                  setFilters({ sortBy: newSortBy, sortOrder: newSortOrder });
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
              >
                <option value="publishedAt_desc">Newest First</option>
                <option value="publishedAt_asc">Oldest First</option>
                <option value="viewCount_desc">Most Popular</option>
                <option value="title_asc">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}