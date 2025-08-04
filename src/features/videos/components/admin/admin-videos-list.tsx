// ABOUTME: Admin component for displaying paginated list of videos
// ABOUTME: Shows video cards with thumbnails, metadata, and management actions

import Link from 'next/link';
import { getVideos } from '@/features/videos/queries/get-videos';
import { parseVideoSearchParams } from '@/features/videos/search-params';
import { AdminPagination } from '@/features/admin/components/admin-pagination';
import { VideoCard } from './admin-video-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminVideosListProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function AdminVideosList({ searchParams }: AdminVideosListProps) {
  const parsedParams = parseVideoSearchParams(searchParams);
  const { list: videos, metadata } = await getVideos(parsedParams);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          🎥
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
        <p className="text-gray-600 mb-6">
          {parsedParams.search || parsedParams.seriesId || parsedParams.isPremium !== undefined
            ? 'Try adjusting your search filters.'
            : 'Get started by adding your first video.'}
        </p>
        <Link href="/admin/videos/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {videos.length} of {metadata.count.toLocaleString()} videos
        </p>
        <div className="text-sm text-gray-500">
          Page {metadata.page} of {metadata.totalPages}
        </div>
      </div>

      {/* Videos grid */}
      <div className="grid gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Pagination */}
      {metadata.totalPages > 1 && (
        <AdminPagination metadata={metadata} />
      )}
    </div>
  );
}