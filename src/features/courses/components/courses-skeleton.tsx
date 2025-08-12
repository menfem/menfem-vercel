// ABOUTME: Loading skeleton component for courses page using unified skeleton system
// ABOUTME: Shows placeholder content while courses are loading with consistent patterns

import { Skeleton, SkeletonGrid } from '@/components/ui/skeleton';

export function CoursesSkeleton() {
  return (
    <div className="space-y-12">
      {/* Enrolled Courses Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <SkeletonGrid 
          variant="course" 
          count={3} 
          columns={{ base: 1, md: 2, lg: 3 }} 
        />
      </section>

      {/* Available Courses Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <SkeletonGrid 
          variant="course" 
          count={6} 
          columns={{ base: 1, md: 2, lg: 3 }} 
        />
      </section>
    </div>
  );
}