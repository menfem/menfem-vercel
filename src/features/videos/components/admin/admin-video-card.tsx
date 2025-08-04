// ABOUTME: Admin video card component for list display
// ABOUTME: Shows video thumbnail, metadata, and quick action buttons

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { formatDuration } from '@/features/videos/utils/format-duration';
import type { VideoWithRelations } from '@/features/videos/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoCardProps {
  video: VideoWithRelations;
}

export function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = video.thumbnailUrl || '/images/video-placeholder.jpg';
  
  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
              sizes="128px"
            />
            {video.duration && (
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                {formatDuration(video.duration)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                <Link 
                  href={`/admin/videos/${video.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {video.title}
                </Link>
              </h3>
              
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={video.isPublished ? "default" : "secondary"}>
                  {video.isPublished ? 'Published' : 'Draft'}
                </Badge>
                {video.isPremium && (
                  <Badge variant="outline">Premium</Badge>
                )}
                {video.series && (
                  <Badge variant="outline">{video.series.title}</Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {video.description || 'No description provided.'}
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>{video.viewCount.toLocaleString()} views</span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                {video.tags && video.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{video.tags.length} tags</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/admin/videos/${video.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/videos/${video.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Video
                    </Link>
                  </DropdownMenuItem>
                  {video.youtubeId && (
                    <DropdownMenuItem asChild>
                      <a 
                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View on YouTube
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}