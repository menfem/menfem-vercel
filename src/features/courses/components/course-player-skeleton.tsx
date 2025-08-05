// ABOUTME: Loading skeleton component for the course player
// ABOUTME: Provides placeholder UI while course data is loading

export function CoursePlayerSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation Sidebar Skeleton */}
      <div className="w-80 border-r bg-white">
        {/* Header skeleton */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Module/Lesson skeleton */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, moduleIndex) => (
            <div key={moduleIndex} className="border-b pb-4 last:border-b-0">
              {/* Module header skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Lessons skeleton */}
              <div className="ml-4 space-y-2">
                {Array.from({ length: 4 }).map((_, lessonIndex) => (
                  <div key={lessonIndex} className="flex items-center p-2">
                    <div className="h-4 w-4 bg-gray-200 rounded-full mr-3 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="flex items-center gap-3">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse" />
                <div className="h-2 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Lesson title skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>

            {/* Video skeleton */}
            <div className="mb-8">
              <div className="bg-gray-200 rounded-lg aspect-video animate-pulse" />
              <div className="mt-4">
                <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded mr-2 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
              
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls skeleton */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-8 bg-gray-200 rounded w-28 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}