// ABOUTME: Loading skeleton for event detail page
// ABOUTME: Shows placeholder content while event data is being fetched

export default function EventLoading() {
  return (
    <div className="min-h-screen bg-brand-sand animate-pulse">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Skeleton */}
            <div className="aspect-video bg-gray-200 rounded-lg mb-6" />

            {/* Content Skeleton */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card Skeleton */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>

              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>

            {/* Details Card Skeleton */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}