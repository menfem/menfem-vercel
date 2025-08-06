// ABOUTME: Server action for creating new videos with YouTube integration
// ABOUTME: Handles video creation with metadata fetching and tag association

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createVideoSchema } from '../schema/video';
import { extractYouTubeId } from '../utils/extract-youtube-id';
import { generateYouTubeUrls } from '../utils/extract-youtube-id';
import { fetchYouTubeMetadata } from '../services/youtube-api';

export async function createVideo(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      seriesId: formData.get('seriesId') as string || undefined,
      isPremium: formData.get('isPremium') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      tags: formData.getAll('tags') as string[],
    };

    const validatedData = createVideoSchema.parse(rawData);

    // Extract YouTube video ID
    const youtubeId = extractYouTubeId(validatedData.youtubeUrl);
    if (!youtubeId) {
      return {
        status: 'ERROR',
        message: 'Invalid YouTube URL format',
        fieldErrors: {
          youtubeUrl: ['Please enter a valid YouTube URL'],
        },
      };
    }

    // Check if video already exists
    const existingVideo = await prisma.video.findUnique({
      where: { youtubeId },
    });

    if (existingVideo) {
      return {
        status: 'ERROR',
        message: 'A video with this YouTube URL already exists',
        fieldErrors: {
          youtubeUrl: ['This video has already been added'],
        },
      };
    }

    // Fetch metadata from YouTube
    let youtubeMetadata;
    try {
      youtubeMetadata = await fetchYouTubeMetadata(youtubeId);
    } catch {
      return {
        status: 'ERROR',
        message: 'Failed to fetch video information from YouTube',
        fieldErrors: {
          youtubeUrl: ['Unable to access this video. Please check the URL and privacy settings'],
        },
      };
    }

    // Generate YouTube URLs
    const urls = generateYouTubeUrls(youtubeId);

    // Create video with tags in a transaction
    const video = await prisma.$transaction(async (tx) => {
      // Create the video
      const newVideo = await tx.video.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          youtubeId,
          embedUrl: urls.embed,
          thumbnailUrl: youtubeMetadata.thumbnailUrl,
          duration: youtubeMetadata.duration,
          seriesId: validatedData.seriesId,
          isPremium: validatedData.isPremium,
          isPublished: validatedData.isPublished,
        },
      });

      // Associate tags if provided
      if (validatedData.tags.length > 0) {
        await tx.videoTag.createMany({
          data: validatedData.tags.map(tagId => ({
            videoId: newVideo.id,
            tagId,
          })),
        });
      }

      return newVideo;
    });

    // Revalidate relevant pages
    revalidatePath('/admin/videos');
    revalidatePath('/watch');
    if (video.seriesId) {
      revalidatePath(`/watch/series/${video.seriesId}`);
    }

    return toActionState('SUCCESS', 'Video created successfully');

  } catch (error) {
    console.error('Create video error:', error);
    return fromErrorToActionState(error, formData);
  }
}