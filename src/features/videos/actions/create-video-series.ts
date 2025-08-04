// ABOUTME: Server action for creating video series
// ABOUTME: Handles video series creation and organization

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createVideoSeriesSchema } from '../schema/video';

export async function createVideoSeries(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      thumbnailUrl: formData.get('thumbnailUrl') as string || undefined,
      isPremium: formData.get('isPremium') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      order: parseInt(formData.get('order') as string) || 0,
    };

    const validatedData = createVideoSeriesSchema.parse(rawData);

    // Check if series with same title already exists
    const existingSeries = await prisma.videoSeries.findFirst({
      where: {
        title: {
          equals: validatedData.title,
          mode: 'insensitive',
        },
      },
    });

    if (existingSeries) {
      return {
        status: 'ERROR',
        message: 'A series with this title already exists',
        fieldErrors: {
          title: ['This title is already in use'],
        },
      };
    }

    // Create the video series
    const series = await prisma.videoSeries.create({
      data: validatedData,
    });

    // Revalidate relevant pages
    revalidatePath('/admin/videos');
    revalidatePath('/admin/videos/series');
    revalidatePath('/watch');

    return toActionState('SUCCESS', 'Video series created successfully', {
      seriesId: series.id,
    });

  } catch (error) {
    console.error('Create video series error:', error);
    return fromErrorToActionState(error, formData);
  }
}