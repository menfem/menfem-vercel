// ABOUTME: Related videos sidebar component for video discovery
// ABOUTME: Shows list of related videos based on series, tags, or category

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '../utils/format-duration';
import type { VideoListItem } from '../types';

interface RelatedVideosProps {
  videos: VideoListItem[];
}

export function RelatedVideos({ videos }: RelatedVideosProps) {
  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Videos</h3>
        <p className="text-gray-600 text-sm">No related videos found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Related Videos
      </h3>
      
      <div className="space-y-4">
        {videos.map((video) => (
          <RelatedVideoItem key={video.id} video={video} />
        ))}
      </div>

      {videos.length >= 5 && (
        <div className="pt-4 border-t mt-4">
          <Link 
            href="/watch" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all videos →
          </Link>
        </div>
      )}
    </div>
  );
}

function RelatedVideoItem({ video }: { video: VideoListItem }) {
  return (
    <Link 
      href={`/watch/${video.id}`}
      className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-24 aspect-video bg-gray-100 rounded flex-shrink-0 overflow-hidden">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-lg">🎥</div>
          </div>
        )}
        
        {/* Duration overlay */}
        {video.duration && (
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Premium badge */}
        {video.isPremium && (
          <div className="absolute top-1 left-1">
            <Badge 
              variant="secondary" 
              className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5"
            >
              Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h4>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>{video.viewCount} views</div>
          {video.series && (
            <div className="truncate">
              Series: {video.series.title}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}