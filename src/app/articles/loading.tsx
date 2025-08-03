// ABOUTME: Loading state for the main articles listing page
// ABOUTME: Shows skeleton grid while articles are being fetched

import { ArticleGridSkeleton } from '@/components/loading-states';

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        
        {/* Filters Skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6" />
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-200 rounded w-24" />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <ArticleGridSkeleton count={12} />
      </section>
    </div>
  );
}