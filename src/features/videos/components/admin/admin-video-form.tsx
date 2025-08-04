// ABOUTME: Admin form component for creating and editing videos
// ABOUTME: Handles YouTube URL processing, metadata input, and form submission

'use client';

import { useActionState } from 'react';
import { createVideo } from '@/features/videos/actions/create-video';
import { updateVideo } from '@/features/videos/actions/update-video';
import { Form } from '@/components/form/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubmitButton } from '@/components/form/submit-button';
import { FieldError } from '@/components/form/field-error';
import { ActionFeedback } from '@/components/form/action-feedback';
import { emptyActionState } from '@/types/action-state';
import { X } from 'lucide-react';
import type { VideoWithRelations, VideoSeriesWithVideos } from '@/features/videos/types';
import type { Tag } from '@prisma/client';
import { useState } from 'react';

interface AdminVideoFormProps {
  video?: VideoWithRelations;
  videoSeries: VideoSeriesWithVideos[];
  tags: Tag[];
}

export function AdminVideoForm({ video, videoSeries, tags }: AdminVideoFormProps) {
  const [actionState, formAction] = useActionState(
    video ? updateVideo.bind(null, video.id) : createVideo,
    emptyActionState
  );

  const [selectedTags, setSelectedTags] = useState<string[]>(
    video?.tags?.map(t => t.tag.id) || []
  );

  const [isPublished, setIsPublished] = useState(video?.isPublished || false);
  const [isPremium, setIsPremium] = useState(video?.isPremium || false);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className="bg-white border rounded-lg p-6">
      <Form action={formAction}>
        <div className="space-y-6">
          {/* YouTube URL (only for new videos) */}
          {!video && (
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL *</Label>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="mt-2"
              />
              <FieldError actionState={actionState} name="youtubeUrl" />
              <p className="text-sm text-gray-500 mt-1">
                Paste a YouTube URL to automatically fetch video metadata.
              </p>
            </div>
          )}

          {/* Title (editable for existing videos) */}
          {video && (
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={video.title}
                required
                className="mt-2"
              />
              <FieldError actionState={actionState} name="title" />
            </div>
          )}

          {/* Description (editable for existing videos) */}
          {video && (
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={video.description || ''}
                rows={4}
                className="mt-2"
              />
              <FieldError actionState={actionState} name="description" />
            </div>
          )}

          {/* Video Series */}
          <div>
            <Label htmlFor="seriesId">Video Series</Label>
            <Select name="seriesId" defaultValue={video?.seriesId || ''}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a series (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Series</SelectItem>
                {videoSeries.map((series) => (
                  <SelectItem key={series.id} value={series.id}>
                    {series.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError actionState={actionState} name="seriesId" />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="mt-2 space-y-3">
              {/* Selected Tags */}
              {selectedTagObjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTagObjects.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="default"
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Available Tags */}
              <div className="max-h-32 overflow-y-auto border rounded-md p-3">
                <div className="grid grid-cols-2 gap-2">
                  {tags
                    .filter(tag => !selectedTags.includes(tag.id))
                    .map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className="text-left text-sm p-2 hover:bg-gray-100 rounded"
                      >
                        {tag.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Hidden inputs for selected tags */}
            {selectedTags.map((tagId) => (
              <input
                key={tagId}
                type="hidden"
                name="tags"
                value={tagId}
              />
            ))}
            <FieldError actionState={actionState} name="tags" />
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            
            {/* Published */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublished">Published</Label>
                <p className="text-sm text-gray-500">
                  Make this video visible to users
                </p>
              </div>
              <Switch
                id="isPublished"
                name="isPublished"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>

            {/* Premium */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPremium">Premium Content</Label>
                <p className="text-sm text-gray-500">
                  Require premium subscription to view
                </p>
              </div>
              <Switch
                id="isPremium"
                name="isPremium"
                checked={isPremium}
                onCheckedChange={setIsPremium}
              />
            </div>
          </div>

          {/* Action Feedback */}
          <ActionFeedback actionState={actionState} />

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <SubmitButton>
              {video ? 'Update Video' : 'Create Video'}
            </SubmitButton>
            {video && (
              <Button type="button" variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}