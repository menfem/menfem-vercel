import { ArticleGridSkeleton } from '@/components/loading-states';

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <ArticleGridSkeleton count={12} />
      </div>
    </div>
  );
}