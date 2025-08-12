// ABOUTME: Loading skeleton components for articles using unified skeleton system
// ABOUTME: Provides consistent loading animations for articles, grids, and detail pages

import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonGrid, 
  SkeletonImage,
  SkeletonText,
  SkeletonTitle 
} from '@/components/ui/skeleton';

export function ArticleCardSkeleton() {
  return <SkeletonCard variant="article" />;
}

export function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <SkeletonImage aspect="banner" className="h-96 lg:h-[500px] rounded-none" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-6 w-20 mb-4" />
          <SkeletonTitle className="h-12 mb-4" />
          <SkeletonTitle className="h-6 w-3/4 mb-6" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          
          {/* Content skeleton */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
            <div className="space-y-4">
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonText key={i} />
              ))}
              <SkeletonText className="w-2/3" />
            </div>
          </div>
          
          {/* Tags skeleton */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <Skeleton className="h-5 w-16 mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SkeletonGrid 
      variant="article" 
      count={count} 
      columns={{ base: 1, md: 2, lg: 3 }}
      className="gap-8"
    />
  );
}