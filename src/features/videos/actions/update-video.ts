// ABOUTME: Server action for updating existing videos
// ABOUTME: Handles video metadata updates and tag management

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { updateVideoSchema } from '../schema/video';
import { extractYouTubeId } from '../utils/extract-youtube-id';
import { generateYouTubeUrls } from '../utils/extract-youtube-id';
import { fetchYouTubeMetadata } from '../services/youtube-api';

export async function updateVideo(
  videoId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        tags: true,
      },
    });

    if (!existingVideo) {
      return {
        status: 'ERROR',
        message: 'Video not found',
      };
    }

    // Parse and validate form data
    const rawData = {
      id: videoId,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      seriesId: formData.get('seriesId') as string || undefined,
      isPremium: formData.get('isPremium') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      tags: formData.getAll('tags') as string[],
    };

    const validatedData = updateVideoSchema.parse(rawData);

    // Handle YouTube URL change if provided
    let youtubeId = existingVideo.youtubeId;
    let embedUrl = existingVideo.embedUrl;
    let thumbnailUrl = existingVideo.thumbnailUrl;
    let duration = existingVideo.duration;

    if (validatedData.youtubeUrl && validatedData.youtubeUrl !== existingVideo.embedUrl?.replace('https://www.youtube.com/embed/', '')) {
      const newYoutubeId = extractYouTubeId(validatedData.youtubeUrl);
      if (!newYoutubeId) {
        return {
          status: 'ERROR',
          message: 'Invalid YouTube URL format',
          fieldErrors: {
            youtubeUrl: ['Please enter a valid YouTube URL'],
          },
        };
      }

      // Check if another video already uses this YouTube ID
      const duplicateVideo = await prisma.video.findFirst({
        where: {
          youtubeId: newYoutubeId,
          id: { not: videoId },
        },
      });

      if (duplicateVideo) {
        return {
          status: 'ERROR',
          message: 'Another video already uses this YouTube URL',
          fieldErrors: {
            youtubeUrl: ['This YouTube URL is already in use'],
          },
        };
      }

      // Fetch new metadata
      try {
        const youtubeMetadata = await fetchYouTubeMetadata(newYoutubeId);
        const urls = generateYouTubeUrls(newYoutubeId);
        
        youtubeId = newYoutubeId;
        embedUrl = urls.embed;
        thumbnailUrl = youtubeMetadata.thumbnailUrl;
        duration = youtubeMetadata.duration;
      } catch {
        return {
          status: 'ERROR',
          message: 'Failed to fetch video information from YouTube',
          fieldErrors: {
            youtubeUrl: ['Unable to access this video. Please check the URL and privacy settings'],
          },
        };
      }
    }

    // Update video with tags in a transaction
    const updatedVideo = await prisma.$transaction(async (tx) => {
      // Update the video
      const video = await tx.video.update({
        where: { id: videoId },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          youtubeId,
          embedUrl,
          thumbnailUrl,
          duration,
          seriesId: validatedData.seriesId,
          isPremium: validatedData.isPremium,
          isPublished: validatedData.isPublished,
        },
      });

      // Update tags if provided
      if (validatedData.tags) {
        // Remove existing tags
        await tx.videoTag.deleteMany({
          where: { videoId },
        });

        // Add new tags
        if (validatedData.tags.length > 0) {
          await tx.videoTag.createMany({
            data: validatedData.tags.map(tagId => ({
              videoId,
              tagId,
            })),
          });
        }
      }

      return video;
    });

    // Revalidate relevant pages
    revalidatePath('/admin/videos');
    revalidatePath(`/admin/videos/${videoId}`);
    revalidatePath('/watch');
    revalidatePath(`/watch/${videoId}`);
    
    if (existingVideo.seriesId) {
      revalidatePath(`/watch/series/${existingVideo.seriesId}`);
    }
    if (updatedVideo.seriesId && updatedVideo.seriesId !== existingVideo.seriesId) {
      revalidatePath(`/watch/series/${updatedVideo.seriesId}`);
    }

    return toActionState('SUCCESS', 'Video updated successfully');

  } catch (error) {
    console.error('Update video error:', error);
    return fromErrorToActionState(error, formData);
  }
}