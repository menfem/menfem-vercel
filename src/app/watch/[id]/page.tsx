// ABOUTME: Individual video page for watching videos
// ABOUTME: Shows video player with metadata, premium access control, and related videos

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getVideo } from '@/features/videos/queries/get-video';
import { getVideos } from '@/features/videos/queries/get-videos';
import { getPremiumAccess } from '@/features/auth/queries/get-premium-access';
import { VideoPlayer } from '@/features/videos/components/video-player';
import { VideoMetadata } from '@/features/videos/components/video-metadata';
import { RelatedVideos } from '@/features/videos/components/related-videos';
import { PremiumPaywall } from '@/features/videos/components/premium-paywall';
import { incrementVideoViews } from '@/features/videos/actions/increment-views';
import type { VideoWithRelations } from '@/features/videos/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const video = await getVideo(resolvedParams.id);

  if (!video || !video.isPublished) {
    notFound();
  }

  // Increment view count asynchronously
  incrementVideoViews(video.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <VideoPlayerSection video={video} />
            <VideoMetadata video={video} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<RelatedVideosSkeleton />}>
              <RelatedVideosSection 
                currentVideoId={video.id}
                seriesId={video.seriesId}
                tags={video.tags.map(t => t.tag.id)}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function VideoPlayerSection({ video }: { video: VideoWithRelations }) {
  const { hasAccess } = await getPremiumAccess();

  if (video.isPremium && !hasAccess) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <PremiumPaywall video={video} />
        </div>
      </div>
    );
  }

  return <VideoPlayer video={video} hasAccess={hasAccess} />;
}

async function RelatedVideosSection({
  currentVideoId,
  seriesId,
  tags
}: {
  currentVideoId: string;
  seriesId?: string | null;
  tags: string[];
}) {
  const relatedVideos = await getVideos({
    limit: 5,
    isPublished: true,
    excludeIds: [currentVideoId],
    seriesId: seriesId || undefined,
    tags: tags.length > 0 ? tags : undefined,
  });

  return <RelatedVideos videos={relatedVideos.list} />;
}

function RelatedVideosSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-24 aspect-video bg-gray-200 rounded flex-shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}