// ABOUTME: Video card component for displaying video previews in lists and grids
// ABOUTME: Shows thumbnail, title, description, and premium status with premium access control

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '../utils/format-duration';
import type { VideoListItem } from '../types';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: VideoListItem;
  layout?: 'grid' | 'list';
  showDescription?: boolean;
}

export function VideoCard({ 
  video, 
  layout = 'grid',
  showDescription = true 
}: VideoCardProps) {
  const isGridLayout = layout === 'grid';

  return (
    <Link 
      href={`/watch/${video.id}`}
      className={cn(
        "group block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow",
        isGridLayout ? "space-y-3" : "flex gap-4 p-4"
      )}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative bg-gray-100",
        isGridLayout ? "aspect-video" : "w-48 aspect-video flex-shrink-0"
      )}>
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-4xl">🎥</div>
          </div>
        )}
        
        {/* Duration overlay */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Premium badge */}
        {video.isPremium && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "space-y-2",
        isGridLayout ? "p-4" : "flex-1 min-w-0"
      )}>
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {video.title}
        </h3>

        {showDescription && video.description && (
          <p className={cn(
            "text-gray-600 text-sm",
            isGridLayout ? "line-clamp-2" : "line-clamp-3"
          )}>
            {video.description}
          </p>
        )}

        {/* Series info */}
        {video.series && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Series:</span>
            <span className="font-medium">{video.series.title}</span>
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* View count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{video.viewCount} views</span>
          {video.createdAt && (
            <span>
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}