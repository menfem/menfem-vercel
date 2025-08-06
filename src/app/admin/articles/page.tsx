// ABOUTME: Admin articles listing page with filtering and management
// ABOUTME: Provides comprehensive article management interface for admins

import Link from 'next/link';
import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { AdminArticlesList } from '@/features/admin/components/admin-articles-list';
import { AdminArticlesFilters } from '@/features/admin/components/admin-articles-filters';

interface AdminArticlesPageProps {
  searchParams?: Promise<{
    search?: string;
    published?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function AdminArticlesPage({ 
  searchParams 
}: AdminArticlesPageProps) {
  const resolvedSearchParams = await searchParams || {};
  const page = parseInt(resolvedSearchParams.page || '1');
  const published = resolvedSearchParams.published === 'true' ? true : 
                   resolvedSearchParams.published === 'false' ? false : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600">Manage your content library</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center px-4 py-2 bg-brand-terracotta text-white rounded-md hover:bg-brand-rust transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <AdminArticlesFilters 
        currentSearch={resolvedSearchParams.search || ''}
        currentPublished={resolvedSearchParams.published}
        currentCategory={resolvedSearchParams.category}
      />

      {/* Articles List */}
      <Suspense fallback={<AdminArticlesListSkeleton />}>
        <AdminArticlesList
          search={resolvedSearchParams.search}
          published={published}
          category={resolvedSearchParams.category}
          page={page}
        />
      </Suspense>
    </div>
  );
}

function AdminArticlesListSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}