// ABOUTME: Loading state for culture category page
// ABOUTME: Shows skeleton animation while culture articles are being fetched

import { ArticleGridSkeleton } from '@/components/loading-states';

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-sage animate-pulse">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-8" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
        </div>

        {/* Featured Article Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8" />
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-[21/9] bg-gray-200" />
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-20 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-full mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8" />
        <ArticleGridSkeleton count={9} />
      </section>
    </div>
  );
}