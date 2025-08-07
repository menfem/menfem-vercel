// ABOUTME: Public video library page for browsing and discovering videos
// ABOUTME: Displays paginated video list with filtering and search capabilities

import { Suspense } from 'react';
import { getVideos } from '@/features/videos/queries/get-videos';
import { getAllVideoSeries } from '@/features/videos/queries/get-video-series';
import { videoSearchParamsCache } from '@/features/videos/search-params';
import { VideoLibrary } from '@/features/videos/components/video-library';
import { VideoLibrarySkeleton } from '@/features/videos/components/video-library-skeleton';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WatchPage({ searchParams }: PageProps) {
  const searchParamsValue = await searchParams;
  const parsedParams = videoSearchParamsCache.parse(searchParamsValue);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
          <p className="text-gray-600 mt-2">
            Discover educational content on masculinity, personal development, and culture
          </p>
        </div>

        <Suspense fallback={<VideoLibrarySkeleton />}>
          <VideoLibraryContent searchParams={parsedParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function VideoLibraryContent({ 
  searchParams 
}: { 
  searchParams: any
}) {
  const [videosData, videoSeries] = await Promise.all([
    getVideos({
      ...searchParams,
      isPublished: true, // Only show published videos to public
    }),
    getAllVideoSeries(),
  ]);

  return (
    <VideoLibrary 
      videos={videosData.list}
      metadata={videosData.metadata}
      videoSeries={videoSeries}
      searchParams={searchParams}
    />
  );
}