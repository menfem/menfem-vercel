// ABOUTME: Admin video filters component for search and filtering
// ABOUTME: Provides search, series filter, status filter, and sorting options

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export function AdminVideosFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get('search') || '';
  const currentSeries = searchParams.get('seriesId') || '';
  const currentStatus = searchParams.get('isPublished') || '';
  const currentPremium = searchParams.get('isPremium') || '';
  const currentSort = searchParams.get('sortBy') || 'createdAt';
  const currentOrder = searchParams.get('sortOrder') || 'desc';

  const [search, setSearch] = useState(currentSearch);

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilter('search', value || null);
  }, 300);

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset page when filters change
    params.delete('page');
    
    router.push(`/admin/videos?${params.toString()}`);
  }, [router, searchParams]);

  const clearFilters = useCallback(() => {
    setSearch('');
    router.push('/admin/videos');
  }, [router]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const activeFiltersCount = [
    currentSearch,
    currentSeries,
    currentStatus,
    currentPremium,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Series Filter */}
          <Select 
            value={currentSeries} 
            onValueChange={(value) => updateFilter('seriesId', value || null)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Series</SelectItem>
              {/* TODO: Add actual series options from API */}
              <SelectItem value="series1">Series 1</SelectItem>
              <SelectItem value="series2">Series 2</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select 
            value={currentStatus} 
            onValueChange={(value) => updateFilter('isPublished', value || null)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Premium Filter */}
          <Select 
            value={currentPremium} 
            onValueChange={(value) => updateFilter('isPremium', value || null)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Access</SelectItem>
              <SelectItem value="true">Premium</SelectItem>
              <SelectItem value="false">Free</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select 
            value={`${currentSort}_${currentOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('_');
              updateFilter('sortBy', sortBy);
              updateFilter('sortOrder', sortOrder);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Newest First</SelectItem>
              <SelectItem value="createdAt_asc">Oldest First</SelectItem>
              <SelectItem value="title_asc">Title A-Z</SelectItem>
              <SelectItem value="title_desc">Title Z-A</SelectItem>
              <SelectItem value="viewCount_desc">Most Views</SelectItem>
              <SelectItem value="viewCount_asc">Least Views</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
          {currentSearch && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{currentSearch}"
              <button 
                onClick={() => {
                  setSearch('');
                  updateFilter('search', null);
                }}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {currentStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {currentStatus === 'true' ? 'Published' : 'Draft'}
              <button 
                onClick={() => updateFilter('isPublished', null)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {currentPremium && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Access: {currentPremium === 'true' ? 'Premium' : 'Free'}
              <button 
                onClick={() => updateFilter('isPremium', null)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}