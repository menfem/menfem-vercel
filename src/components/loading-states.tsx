// ABOUTME: Loading skeleton components for various page states
// ABOUTME: Provides consistent loading animations for articles, grids, and detail pages

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-6">
        <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-full mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-brand-sage animate-pulse">
      <div className="h-96 lg:h-[500px] bg-gray-200" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-6 bg-gray-200 rounded w-20 mb-4" />
          <div className="h-12 bg-gray-200 rounded w-full mb-4" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-6" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          
          {/* Content skeleton */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
          
          {/* Tags skeleton */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="h-5 bg-gray-200 rounded w-16 mb-4" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-20" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}