// ABOUTME: Video player component with YouTube embed and premium access control
// ABOUTME: Displays video content or paywall based on user's premium status

'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { VideoWithRelations } from '../types';

interface VideoPlayerProps {
  video: VideoWithRelations;
  hasAccess: boolean;
  className?: string;
}

export function VideoPlayer({ video, hasAccess, className }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Track video plays for analytics
  useEffect(() => {
    if (hasAccess && video.embedUrl) {
      // Track video play event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'video_play', {
          video_id: video.id,
          video_title: video.title,
          is_premium: video.isPremium,
        });
      }
    }
  }, [hasAccess, video]);

  if (!video.embedUrl && !video.youtubeId) {
    return (
      <div className={cn(
        "aspect-video bg-gray-100 rounded-lg flex items-center justify-center",
        className
      )}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎥</div>
          <p>Video not available</p>
        </div>
      </div>
    );
  }

  const embedUrl = video.embedUrl || `https://www.youtube.com/embed/${video.youtubeId}`;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <div className="text-4xl mb-2 text-gray-400">⚠️</div>
              <p className="text-gray-600">Failed to load video</p>
              <button 
                onClick={() => {
                  setError(false);
                  setIsLoaded(false);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={`${embedUrl}?rel=0&modestbranding=1&autoplay=0`}
            title={video.title}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>
    </div>
  );
}