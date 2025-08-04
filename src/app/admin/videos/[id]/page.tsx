// ABOUTME: Admin video details page with preview and management actions
// ABOUTME: Shows video information, analytics, and edit/delete options

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { getVideo } from '@/features/videos/queries/get-video';
import { VideoPreview } from '@/features/videos/components/video-preview';
import { AdminVideoActions } from '@/features/videos/components/admin/admin-video-actions';
import { VideoMetrics } from '@/features/videos/components/admin/video-metrics';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminVideoPageProps {
  params: { id: string };
}

export default async function AdminVideoPage({ params }: AdminVideoPageProps) {
  await getAdminOrRedirect();

  const video = await getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/videos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
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
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/admin/videos/${video.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          {video.youtubeId && (
            <a 
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on YouTube
              </Button>
            </a>
          )}
          <AdminVideoActions video={video} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Preview */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h2>
            <VideoPreview video={video} />
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {video.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tagRelation) => (
                  <Badge key={tagRelation.tag.id} variant="outline">
                    {tagRelation.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Info */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="text-sm text-gray-900">
                  {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">View Count</dt>
                <dd className="text-sm text-gray-900">{video.viewCount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(video.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(video.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              {video.youtubeId && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">YouTube ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{video.youtubeId}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Analytics */}
          <VideoMetrics videoId={video.id} />
        </div>
      </div>
    </div>
  );
}