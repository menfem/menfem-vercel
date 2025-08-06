// ABOUTME: Server action for updating video series
// ABOUTME: Handles video series metadata updates and organization

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { updateVideoSeriesSchema } from '../schema/video';

export async function updateVideoSeries(
  seriesId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if series exists
    const existingSeries = await prisma.videoSeries.findUnique({
      where: { id: seriesId },
    });

    if (!existingSeries) {
      return {
        status: 'ERROR',
        message: 'Video series not found',
      };
    }

    // Parse and validate form data
    const rawData = {
      id: seriesId,
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      thumbnailUrl: formData.get('thumbnailUrl') as string || undefined,
      isPremium: formData.get('isPremium') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      order: parseInt(formData.get('order') as string) || 0,
    };

    const validatedData = updateVideoSeriesSchema.parse(rawData);

    // Check if another series with same title already exists (excluding current)
    if (validatedData.title && validatedData.title !== existingSeries.title) {
      const duplicateSeries = await prisma.videoSeries.findFirst({
        where: {
          title: {
            equals: validatedData.title,
            mode: 'insensitive',
          },
          id: { not: seriesId },
        },
      });

      if (duplicateSeries) {
        return {
          status: 'ERROR',
          message: 'A series with this title already exists',
          fieldErrors: {
            title: ['This title is already in use'],
          },
        };
      }
    }

    // Update the video series
    await prisma.videoSeries.update({
      where: { id: seriesId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        thumbnailUrl: validatedData.thumbnailUrl,
        isPremium: validatedData.isPremium,
        isPublished: validatedData.isPublished,
        order: validatedData.order,
      },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/videos');
    revalidatePath('/admin/videos/series');
    revalidatePath(`/admin/videos/series/${seriesId}`);
    revalidatePath('/watch');
    revalidatePath(`/watch/series/${seriesId}`);

    return toActionState('SUCCESS', 'Video series updated successfully');

  } catch (error) {
    console.error('Update video series error:', error);
    return fromErrorToActionState(error, formData);
  }
}