// ABOUTME: Server action for marking lessons as completed
// ABOUTME: Handles lesson completion tracking and progress updates

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { completeLessonSchema } from '../schema/course';

export async function completeLesson(
  lessonId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check authentication
    const { user } = await getAuthOrRedirect();

    // Validate input
    completeLessonSchema.parse({
      lessonId,
      userId: user.id,
    });

    // Check if lesson exists and user has access
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!lesson || !lesson.isPublished) {
      return {
        status: 'ERROR',
        message: 'Lesson not found or not available',
      };
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment) {
      return {
        status: 'ERROR',
        message: 'You are not enrolled in this course',
      };
    }

    // Check if lesson is already completed
    const existingCompletion = await prisma.lessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
    });

    if (existingCompletion) {
      return {
        status: 'SUCCESS',
        message: 'Lesson already completed',
      };
    }

    // Complete the lesson and update progress in a transaction
    await prisma.$transaction(async (tx) => {
      // Mark lesson as completed
      await tx.lessonCompletion.create({
        data: {
          userId: user.id,
          lessonId,
        },
      });

      // Calculate and update course progress
      const courseProgress = await calculateCourseProgressForUser(
        tx,
        lesson.module.courseId,
        user.id
      );

      await tx.courseEnrollment.update({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: lesson.module.courseId,
          },
        },
        data: {
          progress: courseProgress.overallProgress,
          ...(courseProgress.overallProgress >= 100 && {
            completedAt: new Date(),
          }),
        },
      });
    });

    // Revalidate relevant pages
    revalidatePath(`/courses/${lesson.module.courseId}`);
    revalidatePath(`/courses/${lesson.module.courseId}/lessons/${lessonId}`);
    revalidatePath('/dashboard');

    return toActionState('SUCCESS', 'Lesson completed successfully', {
      lessonId,
      courseId: lesson.module.courseId,
    });

  } catch (error) {
    console.error('Complete lesson error:', error);
    return fromErrorToActionState(error, formData);
  }
}

// Helper function to calculate course progress
async function calculateCourseProgressForUser(
  tx: any,
  courseId: string,
  userId: string
) {
  // Get total lessons in course
  const totalLessons = await tx.courseLesson.count({
    where: {
      module: {
        courseId,
        isPublished: true,
      },
      isPublished: true,
    },
  });

  // Get completed lessons by user
  const completedLessons = await tx.lessonCompletion.count({
    where: {
      userId,
      lesson: {
        module: {
          courseId,
          isPublished: true,
        },
        isPublished: true,
      },
    },
  });

  const overallProgress = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  return {
    totalLessons,
    completedLessons,
    overallProgress,
  };
}