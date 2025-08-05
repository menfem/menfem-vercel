// ABOUTME: Video metadata component showing title, description, tags, and stats
// ABOUTME: Displays comprehensive video information below the player

import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Clock, Tag } from 'lucide-react';
import { formatDuration } from '../utils/format-duration';
import type { VideoWithRelations } from '../types';

interface VideoMetadataProps {
  video: VideoWithRelations;
}

export function VideoMetadata({ video }: VideoMetadataProps) {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      {/* Title and Status */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {video.title}
          </h1>
          {video.isPremium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex-shrink-0">
              Premium
            </Badge>
          )}
        </div>

        {/* Series info */}
        {video.series && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Part of series:</span>
            <Badge variant="outline">{video.series.title}</Badge>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{video.viewCount.toLocaleString()} views</span>
        </div>
        
        {video.duration && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(video.duration)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            Published {new Date(video.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Description */}
      {video.description && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="outline" className="text-sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}