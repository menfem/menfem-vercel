// ABOUTME: Video filtering component for search and filter controls
// ABOUTME: Provides search input, series filter, and premium content toggle

'use client';

import { useQueryState, parseAsString, parseAsBoolean } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import type { VideoSeriesWithVideos } from '../types';

interface VideoFiltersProps {
  videoSeries: VideoSeriesWithVideos[];
  searchParams: Record<string, string | string[] | undefined>;
}

export function VideoFilters({ videoSeries }: Omit<VideoFiltersProps, 'searchParams'>) {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [seriesId, setSeriesId] = useQueryState('seriesId', parseAsString.withDefault(''));
  const [isPremium, setIsPremium] = useQueryState('isPremium', parseAsBoolean);

  const hasActiveFilters = search || seriesId || isPremium !== null;

  const clearFilters = () => {
    setSearch('');
    setSeriesId('');
    setIsPremium(null);
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filter Videos</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Series Filter */}
        <Select value={seriesId} onValueChange={setSeriesId}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by series" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Series</SelectItem>
            {videoSeries.map((series) => (
              <SelectItem key={series.id} value={series.id}>
                {series.title} ({series._count.videos})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Premium Filter */}
        <Select
          value={isPremium === null ? '' : isPremium.toString()}
          onValueChange={(value) => 
            setIsPremium(value === '' ? null : value === 'true')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by access" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Videos</SelectItem>
            <SelectItem value="false">Free Content</SelectItem>
            <SelectItem value="true">Premium Content</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: &quot;{search}&quot;
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {seriesId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Series: {videoSeries.find(s => s.id === seriesId)?.title}
              <button onClick={() => setSeriesId('')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {isPremium !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {isPremium ? 'Premium' : 'Free'} Content
              <button onClick={() => setIsPremium(null)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}