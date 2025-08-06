// ABOUTME: Admin video series management page
// ABOUTME: Lists and manages video series with creation and editing options

import Link from 'next/link';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { getVideoSeries } from '@/features/videos/queries/get-video-series';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default async function AdminVideoSeriesPage() {
  await getAdminOrRedirect();
  
  const videoSeries = await getVideoSeries();

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
            <h1 className="text-2xl font-bold text-gray-900">Video Series</h1>
            <p className="text-gray-600">Organize your videos into series</p>
          </div>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Series
        </Button>
      </div>

      {/* Series List */}
      <div className="space-y-4">
        {videoSeries.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              📺
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No video series yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first video series to organize your content.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Series
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {videoSeries.map((series) => (
              <div key={series.id} className="bg-white border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {series.title}
                      </h3>
                      <Badge variant={series.isPublished ? "default" : "secondary"}>
                        {series.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {series.isPremium && (
                        <Badge variant="outline">Premium</Badge>
                      )}
                    </div>
                    
                    {series.description && (
                      <p className="text-gray-600 mb-3">{series.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{series.videos.length} videos</span>
                      <span>•</span>
                      <span>Created {new Date(series.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Video List Preview */}
                {series.videos.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Videos in this series:</h4>
                    <div className="space-y-2">
                      {series.videos.slice(0, 3).map((video) => (
                        <div key={video.id} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-700 truncate">{video.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {video.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      ))}
                      {series.videos.length > 3 && (
                        <div className="text-xs text-gray-500 ml-5">
                          +{series.videos.length - 3} more videos
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}