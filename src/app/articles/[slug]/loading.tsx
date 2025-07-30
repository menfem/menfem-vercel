// ABOUTME: Loading state component for article detail pages
// ABOUTME: Shows skeleton animation while article data is being fetched

import { ArticleDetailSkeleton } from '@/components/loading-states';

export default function Loading() {
  return <ArticleDetailSkeleton />;
}