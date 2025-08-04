// ABOUTME: Server action for deleting video series
// ABOUTME: Handles video series deletion with proper handling of associated videos

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

export async function deleteVideoSeries(
  seriesId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if series exists and get related data
    const series = await prisma.videoSeries.findUnique({
      where: { id: seriesId },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!series) {
      return {
        status: 'ERROR',
        message: 'Video series not found',
      };
    }

    // Handle series with videos
    if (series._count.videos > 0) {
      // Option 1: Prevent deletion if videos exist
      return {
        status: 'ERROR',
        message: `Cannot delete series: it contains ${series._count.videos} video(s). Please move or delete the videos first.`,
      };

      // Option 2: Move videos to no series (uncomment if preferred)
      // await prisma.video.updateMany({
      //   where: { seriesId },
      //   data: { seriesId: null },
      // });
    }

    // Delete the video series
    await prisma.videoSeries.delete({
      where: { id: seriesId },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/videos');
    revalidatePath('/admin/videos/series');
    revalidatePath('/watch');

    return toActionState('SUCCESS', 'Video series deleted successfully');

  } catch (error) {
    console.error('Delete video series error:', error);
    return fromErrorToActionState(error, formData);
  }
}

export async function deleteVideoSeriesAndRedirect(seriesId: string): Promise<never> {
  const result = await deleteVideoSeries(seriesId);
  
  if (result.status === 'ERROR') {
    // If deletion failed, redirect to the series page with error
    redirect(`/admin/videos/series/${seriesId}?error=${encodeURIComponent(result.message || 'Failed to delete series')}`);
  }
  
  // Success - redirect to admin series list
  redirect('/admin/videos/series?success=Video series deleted successfully');
}