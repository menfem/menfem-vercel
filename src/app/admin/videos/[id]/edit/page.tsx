// ABOUTME: Admin video edit page for updating video metadata
// ABOUTME: Form for editing video title, description, tags, and settings

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { getVideo } from '@/features/videos/queries/get-video';
import { getVideoSeriesForAdmin } from '@/features/videos/queries/get-video-series';
import { getTags } from '@/features/admin/queries/get-categories';
import { AdminVideoForm } from '@/features/videos/components/admin/admin-video-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AdminEditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditVideoPage({ params }: AdminEditVideoPageProps) {
  await getAdminOrRedirect();
  const { id } = await params;

  const [video, videoSeries, tags] = await Promise.all([
    getVideo(id),
    getVideoSeriesForAdmin(),
    getTags(),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/videos/${video.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Video
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
          <p className="text-gray-600">{video.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <AdminVideoForm 
          video={video} 
          videoSeries={videoSeries} 
          tags={tags} 
        />
      </div>
    </div>
  );
}