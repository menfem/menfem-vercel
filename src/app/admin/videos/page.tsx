// ABOUTME: Admin video management list page
// ABOUTME: Displays all videos with filtering, searching, and management actions

import { Suspense } from 'react';
import Link from 'next/link';
import { AdminVideosList } from '@/features/videos/components/admin/admin-videos-list';
import { AdminVideosFilters } from '@/features/videos/components/admin/admin-videos-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';

interface AdminVideosPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminVideosPage({ searchParams }: AdminVideosPageProps) {
  await getAdminOrRedirect();
  
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
          <p className="text-gray-600">Manage your video content and series</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/videos/series">
            <Button variant="outline">
              Manage Series
            </Button>
          </Link>
          <Link href="/admin/videos/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-16 bg-gray-100 rounded-lg animate-pulse" />}>
        <AdminVideosFilters />
      </Suspense>

      {/* Videos List */}
      <Suspense fallback={<AdminVideosListSkeleton />}>
        <AdminVideosList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}

function AdminVideosListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="flex gap-4">
            <div className="w-32 h-20 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            <div className="w-24 space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}