// ABOUTME: Admin page for adding new videos via YouTube URL
// ABOUTME: Form for creating videos with series assignment and metadata

import { AdminVideoForm } from '@/features/videos/components/admin/admin-video-form';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { getVideoSeries } from '@/features/videos/queries/get-video-series';
import { getTags } from '@/features/admin/queries/get-categories'; // Reuse tags query
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminNewVideoPage() {
  await getAdminOrRedirect();

  // Fetch data needed for the form
  const [videoSeries, tags] = await Promise.all([
    getVideoSeries(),
    getTags(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/videos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Video</h1>
          <p className="text-gray-600">Add a video from YouTube with metadata</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <AdminVideoForm videoSeries={videoSeries} tags={tags} />
      </div>
    </div>
  );
}