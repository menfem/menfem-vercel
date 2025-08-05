// ABOUTME: Enhanced video player with progress tracking and engagement analytics
// ABOUTME: Supports YouTube embeds, custom videos, and lesson completion tracking

'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedVideoPlayerProps {
  video: {
    id: string;
    title: string;
    url?: string;
    youtubeId?: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    isPremium?: boolean;
  };
  hasAccess: boolean;
  onProgress?: (progressSeconds: number, totalSeconds: number) => void;
  onComplete?: () => void;
  onEngagement?: (eventType: string, data: any) => void;
  showControls?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export function EnhancedVideoPlayer({
  video,
  hasAccess,
  onProgress,
  onComplete,
  onEngagement,
  showControls = true,
  autoPlay = false,
  className
}: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Progress tracking
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      progressIntervalRef.current = setInterval(() => {
        const video = videoRef.current;
        if (video) {
          const current = video.currentTime;
          const total = video.duration;
          
          setCurrentTime(current);
          
          // Report progress to parent
          if (onProgress) {
            onProgress(current, total);
          }

          // Track engagement events
          if (onEngagement) {
            const progressPercent = (current / total) * 100;
            
            // Track milestone events
            if (progressPercent >= 25 && current >= 15) {
              onEngagement('video_progress_25', { videoId: video.id, timestamp: current });
            }
            if (progressPercent >= 50 && current >= 30) {
              onEngagement('video_progress_50', { videoId: video.id, timestamp: current });
            }
            if (progressPercent >= 75 && current >= 45) {
              onEngagement('video_progress_75', { videoId: video.id, timestamp: current });
            }
          }

          // Auto-complete when 90% watched
          if (current / total >= 0.9 && onComplete) {
            onComplete();
          }
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, onProgress, onComplete, onEngagement, video.id]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        onEngagement?.('video_pause', { videoId: video.id, timestamp: currentTime });
      } else {
        videoRef.current.play();
        onEngagement?.('video_play', { videoId: video.id, timestamp: currentTime });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      onEngagement?.('video_seek', { videoId: video.id, from: currentTime, to: newTime });
    }
  };

  const handleSpeedChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
      onEngagement?.('video_speed_change', { videoId: video.id, rate });
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Premium content paywall
  if (video.isPremium && !hasAccess) {
    return (
      <div className={cn("relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Play className="h-8 w-8 text-yellow-600" />
            </div>
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">Premium Content</Badge>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
            <p className="text-gray-600 mb-6">Upgrade to premium to access this exclusive video content</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upgrade to Premium
            </Button>
          </div>
        </div>
        {video.thumbnailUrl && (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
      </div>
    );
  }

  // YouTube embed
  if (video.youtubeId && video.embedUrl) {
    return (
      <div className={cn("aspect-video rounded-lg overflow-hidden", className)}>
        {!isLoaded && (
          <div className="aspect-video bg-gray-100 animate-pulse flex items-center justify-center">
            <Play className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <iframe
          src={`${video.embedUrl}?rel=0&modestbranding=1&enablejsapi=1${autoPlay ? '&autoplay=1' : ''}`}
          title={video.title}
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    );
  }

  // Custom video player
  if (video.url) {
    return (
      <div className={cn("relative aspect-video bg-black rounded-lg overflow-hidden group", className)}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={video.thumbnailUrl}
          preload="metadata"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
              setIsLoaded(true);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onComplete?.();
          }}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Loading video...</p>
            </div>
          </div>
        )}

        {/* Custom controls */}
        {showControls && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Play/Pause overlay */}
            <Button
              variant="secondary"
              size="icon"
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white border-none h-16 w-16"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
        )}

        {/* Bottom controls */}
        {showControls && isLoaded && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Progress bar */}
            <div className="mb-4">
              <Progress 
                value={(currentTime / duration) * 100} 
                className="h-1 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  handleSeek(percentage * duration);
                }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-300 p-1"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-300 p-1"
                  onClick={handleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed control */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-gray-300 p-1 text-xs"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    {playbackRate}x
                  </Button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded p-2 min-w-24">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          className="block w-full text-left px-2 py-1 text-xs text-white hover:bg-gray-700 rounded"
                          onClick={() => handleSpeedChange(rate)}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-300 p-1"
                  onClick={handleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for no video
  return (
    <div className={cn("aspect-video bg-gray-100 rounded-lg flex items-center justify-center", className)}>
      <div className="text-center text-gray-500">
        <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Video not available</p>
      </div>
    </div>
  );
}