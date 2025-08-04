// ABOUTME: Server action for deleting videos
// ABOUTME: Handles video deletion with proper cleanup of related data

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';

export async function deleteVideo(
  videoId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if video exists and get related data
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        lessons: true, // Check if used in courses
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!video) {
      return {
        status: 'ERROR',
        message: 'Video not found',
      };
    }

    // Check if video is used in courses
    if (video._count.lessons > 0) {
      return {
        status: 'ERROR',
        message: `Cannot delete video: it is used in ${video._count.lessons} course lesson(s). Please remove it from courses first.`,
      };
    }

    // Delete video and all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete video tags (cascade will handle this, but being explicit)
      await tx.videoTag.deleteMany({
        where: { videoId },
      });

      // Delete video transcripts
      await tx.videoTranscript.deleteMany({
        where: { videoId },
      });

      // Delete the video
      await tx.video.delete({
        where: { id: videoId },
      });
    });

    // Revalidate relevant pages
    revalidatePath('/admin/videos');
    revalidatePath('/watch');
    if (video.seriesId) {
      revalidatePath(`/watch/series/${video.seriesId}`);
    }

    return toActionState('SUCCESS', 'Video deleted successfully');

  } catch (error) {
    console.error('Delete video error:', error);
    return fromErrorToActionState(error, formData);
  }
}

export async function deleteVideoAndRedirect(videoId: string): Promise<never> {
  const result = await deleteVideo(videoId);
  
  if (result.status === 'ERROR') {
    // If deletion failed, redirect to the video page with error
    redirect(`/admin/videos/${videoId}?error=${encodeURIComponent(result.message || 'Failed to delete video')}`);
  }
  
  // Success - redirect to admin videos list
  redirect('/admin/videos?success=Video deleted successfully');
}