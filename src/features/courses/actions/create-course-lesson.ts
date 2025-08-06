// ABOUTME: Server action for creating course lessons
// ABOUTME: Handles lesson creation with video integration and ordering

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createCourseLessonSchema } from '../schema/course';

export async function createCourseLesson(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      moduleId: formData.get('moduleId') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      videoId: formData.get('videoId') as string || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
    };

    const validatedData = createCourseLessonSchema.parse(rawData);

    // Check if module exists
    const courseModule = await prisma.courseModule.findUnique({
      where: { id: validatedData.moduleId },
      include: {
        course: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!courseModule) {
      return {
        status: 'ERROR',
        message: 'Course module not found',
        fieldErrors: {
          moduleId: ['Selected module does not exist'],
        },
      };
    }

    // Check if video exists (if provided)
    if (validatedData.videoId) {
      const video = await prisma.video.findUnique({
        where: { id: validatedData.videoId },
      });

      if (!video) {
        return {
          status: 'ERROR',
          message: 'Selected video not found',
          fieldErrors: {
            videoId: ['Video does not exist'],
          },
        };
      }
    }

    // Auto-assign order if not provided
    let lessonOrder = validatedData.order;
    if (lessonOrder === 0) {
      const lastLesson = await prisma.courseLesson.findFirst({
        where: { moduleId: validatedData.moduleId },
        orderBy: { order: 'desc' },
      });
      lessonOrder = (lastLesson?.order ?? -1) + 1;
    }

    // Check if another lesson exists with the same order in this module
    const conflictingLesson = await prisma.courseLesson.findFirst({
      where: {
        moduleId: validatedData.moduleId,
        order: lessonOrder,
      },
    });

    if (conflictingLesson) {
      return {
        status: 'ERROR',
        message: 'A lesson with this order already exists in this module',
        fieldErrors: {
          order: ['Please choose a different order number'],
        },
      };
    }

    // Create the lesson
    const lesson = await prisma.courseLesson.create({
      data: {
        ...validatedData,
        order: lessonOrder,
      },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${courseModule.courseId}`);
    revalidatePath(`/admin/courses/modules/${validatedData.moduleId}`);
    revalidatePath(`/courses/${courseModule.courseId}`);

    return toActionState('SUCCESS', 'Course lesson created successfully', {
      lessonId: lesson.id,
      moduleId: validatedData.moduleId,
      courseId: courseModule.courseId,
    });

  } catch (error) {
    console.error('Create course lesson error:', error);
    return fromErrorToActionState(error, formData);
  }
}