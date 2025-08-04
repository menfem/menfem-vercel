// ABOUTME: Advanced search filters component for the search results page
// ABOUTME: Provides comprehensive filtering options with URL state persistence

'use client';

import { useState } from 'react';
import { useQueryState, useQueryStates } from 'nuqs';
import { Button } from '@/components/ui/button';
import { SearchWithSuggestions } from '@/features/search/components/search-with-suggestions';
import { parseAsString } from 'nuqs';

interface SearchFiltersProps {
  currentQuery: string;
}

export function SearchFilters({ currentQuery }: SearchFiltersProps) {
  const [{ q, category, tags, sortBy, sortOrder, isPremium, readingTime }, setFilters] = useQueryStates({
    q: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
    tags: parseAsString.withDefault(''),
    sortBy: parseAsString.withDefault('publishedAt'),
    sortOrder: parseAsString.withDefault('desc'),
    isPremium: parseAsString.withDefault(''),
    readingTime: parseAsString.withDefault(''),
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      {/* Main Search Bar */}
      <div className="mb-6">
        <SearchWithSuggestions
          value={q || currentQuery}
          onChange={(value) => setFilters({ q: value })}
          placeholder="Search articles..."
        />
      </div>

      {/* Quick Category Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
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
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-brand-brown"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>
        
        {/* Clear All Filters */}
        {(category || tags || isPremium || readingTime || q !== currentQuery) && (
          <Button
            variant="outline"
            onClick={() => setFilters({ 
              q: '', 
              category: '', 
              tags: '', 
              sortBy: 'publishedAt', 
              sortOrder: 'desc',
              isPremium: '',
              readingTime: ''
            })}
            className="text-sm"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <option value="title_desc">Title Z-A</option>
              </select>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contentType"
                    value=""
                    checked={isPremium === ''}
                    onChange={() => setFilters({ isPremium: '' })}
                    className="mr-2 text-brand-terracotta focus:ring-brand-terracotta"
                  />
                  <span className="text-sm">All Articles</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contentType"
                    value="false"
                    checked={isPremium === 'false'}
                    onChange={() => setFilters({ isPremium: 'false' })}
                    className="mr-2 text-brand-terracotta focus:ring-brand-terracotta"
                  />
                  <span className="text-sm">Free Articles</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contentType"
                    value="true"
                    checked={isPremium === 'true'}
                    onChange={() => setFilters({ isPremium: 'true' })}
                    className="mr-2 text-brand-terracotta focus:ring-brand-terracotta"
                  />
                  <span className="text-sm">Premium Articles</span>
                </label>
              </div>
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Time
              </label>
              <select 
                value={readingTime}
                onChange={(e) => setFilters({ readingTime: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
              >
                <option value="">Any Length</option>
                <option value="quick">Quick Read (&lt; 5 min)</option>
                <option value="medium">Medium Read (5-15 min)</option>
                <option value="long">Long Read (15+ min)</option>
              </select>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setFilters({ tags: e.target.value })}
              placeholder="Enter tags separated by commas"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: fashion, mindfulness, career
            </p>
          </div>
        </div>
      )}
    </div>
  );
}