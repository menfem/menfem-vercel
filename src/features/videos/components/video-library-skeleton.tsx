// ABOUTME: Loading skeleton component for video library page using unified skeleton system
// ABOUTME: Shows placeholder content while videos are loading with consistent patterns

import { SkeletonFilters, SkeletonViewToggle, SkeletonGrid } from '@/components/ui/skeleton';

export function VideoLibrarySkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonFilters variant="simple" />
      <SkeletonViewToggle />
      <SkeletonGrid variant="video" count={6} columns={{ base: 1, md: 2, lg: 3 }} />
    </div>
  );
}