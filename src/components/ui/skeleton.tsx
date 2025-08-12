// ABOUTME: Unified skeleton component system for consistent loading states
// ABOUTME: Provides reusable skeleton variants for different content types

import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// Base skeleton primitives
export const SkeletonText = ({ className, ...props }: SkeletonProps) => (
  <Skeleton className={cn('h-4 w-full', className)} {...props} />
);

export const SkeletonTitle = ({ className, ...props }: SkeletonProps) => (
  <Skeleton className={cn('h-6 w-3/4', className)} {...props} />
);

export const SkeletonButton = ({ className, ...props }: SkeletonProps) => (
  <Skeleton className={cn('h-10 w-24', className)} {...props} />
);

export const SkeletonImage = ({ 
  aspect = 'square',
  className, 
  ...props 
}: SkeletonProps & { aspect?: 'square' | 'video' | 'banner' }) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[3/1]'
  };
  
  return (
    <Skeleton 
      className={cn(aspectClasses[aspect], 'w-full', className)} 
      {...props} 
    />
  );
};

// Composite skeleton components
export interface SkeletonCardProps {
  variant?: 'product' | 'video' | 'course' | 'article';
  className?: string;
}

export function SkeletonCard({ variant = 'product', className }: SkeletonCardProps) {
  const baseCard = 'bg-white rounded-lg overflow-hidden shadow-sm';

  switch (variant) {
    case 'product':
      return (
        <div className={cn(baseCard, className)}>
          <SkeletonImage aspect="square" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-20" />
            <SkeletonTitle />
            <div className="space-y-2">
              <SkeletonText />
              <SkeletonText className="w-3/4" />
            </div>
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-2 pt-2">
              <SkeletonButton className="w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>
      );

    case 'video':
      return (
        <div className={cn(baseCard, className)}>
          <SkeletonImage aspect="video" />
          <div className="p-4 space-y-3">
            <SkeletonTitle />
            <div className="space-y-2">
              <SkeletonText />
              <SkeletonText className="w-3/4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      );

    case 'course':
      return (
        <div className={cn(baseCard, className)}>
          <SkeletonImage aspect="video" />
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <SkeletonTitle />
              <SkeletonText className="w-3/4" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            
            <SkeletonButton className="w-full" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>
      );

    case 'article':
      return (
        <div className={cn(baseCard, className)}>
          <SkeletonImage aspect="banner" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <SkeletonTitle />
            <div className="space-y-2">
              <SkeletonText />
              <SkeletonText />
              <SkeletonText className="w-2/3" />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={cn(baseCard, className)}>
          <SkeletonImage />
          <div className="p-4 space-y-3">
            <SkeletonTitle />
            <SkeletonText />
            <SkeletonText />
          </div>
        </div>
      );
  }
}

// Grid skeleton for multiple cards
export interface SkeletonGridProps {
  variant?: 'product' | 'video' | 'course' | 'article';
  count?: number;
  columns?: {
    base?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

export function SkeletonGrid({ 
  variant = 'product', 
  count = 6,
  columns = { base: 1, md: 2, lg: 3 },
  className 
}: SkeletonGridProps) {
  // Use object to map grid column values to Tailwind classes
  const getGridClass = (cols: number, prefix = '') => {
    const gridClasses: Record<number, string> = {
      1: `${prefix}grid-cols-1`,
      2: `${prefix}grid-cols-2`,
      3: `${prefix}grid-cols-3`,
      4: `${prefix}grid-cols-4`,
      5: `${prefix}grid-cols-5`,
      6: `${prefix}grid-cols-6`,
    };
    return gridClasses[cols] || `${prefix}grid-cols-3`;
  };

  const gridClasses = cn(
    'grid gap-6',
    getGridClass(columns.base || 1),
    columns.md && getGridClass(columns.md, 'md:'),
    columns.lg && getGridClass(columns.lg, 'lg:'),
    className
  );

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}

// Filter section skeleton
export interface SkeletonFiltersProps {
  variant?: 'simple' | 'advanced';
  className?: string;
}

export function SkeletonFilters({ variant = 'simple', className }: SkeletonFiltersProps) {
  const baseClasses = 'bg-white rounded-lg border p-6';

  if (variant === 'advanced') {
    return (
      <div className={cn(baseClasses, className)}>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, className)}>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// View mode toggle skeleton
export function SkeletonViewToggle({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Skeleton className="h-4 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}

// Full page layout skeletons
export interface SkeletonPageProps {
  variant: 'catalog' | 'player' | 'dashboard';
  className?: string;
}

export function SkeletonPage({ variant, className }: SkeletonPageProps) {
  switch (variant) {
    case 'catalog':
      return (
        <div className={cn('space-y-6', className)}>
          <SkeletonFilters variant="advanced" />
          <SkeletonViewToggle />
          <SkeletonGrid variant="product" count={6} />
        </div>
      );

    case 'player':
      return (
        <div className={cn('flex h-screen bg-gray-50', className)}>
          {/* Sidebar */}
          <div className="w-80 border-r bg-white">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="ml-4 space-y-2">
                    {Array.from({ length: 4 }, (_, j) => (
                      <div key={j} className="flex items-center p-2">
                        <Skeleton className="h-4 w-4 rounded-full mr-3" />
                        <Skeleton className="h-3 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-2 w-24" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <SkeletonImage aspect="video" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="space-y-2">
                      <SkeletonText />
                      <SkeletonText className="w-5/6" />
                      <SkeletonText className="w-4/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'dashboard':
      return (
        <div className={cn('space-y-8', className)}>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <SkeletonGrid variant="course" count={4} columns={{ base: 1, md: 2, lg: 2 }} />
        </div>
      );

    default:
      return <div>Unknown skeleton variant</div>;
  }
}