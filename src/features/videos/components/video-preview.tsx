// ABOUTME: Video preview component for displaying video player
// ABOUTME: Shows YouTube embed or placeholder for video content

import { cn } from '@/lib/utils';
import type { VideoWithRelations } from '@/features/videos/types';

interface VideoPreviewProps {
  video: VideoWithRelations;
  className?: string;
  showTitle?: boolean;
}

export function VideoPreview({ video, className, showTitle = false }: VideoPreviewProps) {
  if (!video.embedUrl && !video.youtubeId) {
    return (
      <div className={cn(
        "aspect-video bg-gray-100 rounded-lg flex items-center justify-center",
        className
      )}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎥</div>
          <p>No video available</p>
        </div>
      </div>
    );
  }

  const embedUrl = video.embedUrl || `https://www.youtube.com/embed/${video.youtubeId}`;

  return (
    <div className={cn("space-y-4", className)}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
      )}
      
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
        <iframe
          src={`${embedUrl}?rel=0&modestbranding=1`}
          title={video.title}
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {showTitle && video.description && (
        <p className="text-gray-600 text-sm">{video.description}</p>
      )}
    </div>
  );
}