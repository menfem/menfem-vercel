// ABOUTME: Loading skeleton component for the stories listing page
// ABOUTME: Provides smooth loading state while articles are being fetched

export default function StoriesLoading() {
  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Hero Section Skeleton */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-300 rounded mx-auto w-48 mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded mx-auto w-96 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-80 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-64 animate-pulse"></div>
        </div>
        
        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </section>

      {/* Stories Grid Skeleton */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden animate-pulse border-l-4 border-gray-300">
              {/* Image Skeleton */}
              <div className="aspect-[4/3] bg-gray-300"></div>
              
              {/* Content Skeleton */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                
                {/* Title */}
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-4/5 mb-4"></div>
                
                {/* Excerpt */}
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Skeleton */}
      <section className="bg-brand-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 bg-gray-300 rounded mx-auto w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-96 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-80 mb-8 animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded mx-auto w-40 animate-pulse"></div>
        </div>
      </section>
    </div>
  );
}