// ABOUTME: Server action for enrolling users in courses
// ABOUTME: Handles course enrollment with access verification

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { enrollInCourseSchema } from '../schema/course';

export async function enrollInCourse(
  courseId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check authentication
    const { user } = await getAuthOrRedirect();

    // Validate input
    const validatedData = enrollInCourseSchema.parse({
      courseId,
      userId: user.id,
    });

    // Check if course exists and is available
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        product: true,
      },
    });

    if (!course || !course.product.isActive) {
      return {
        status: 'ERROR',
        message: 'Course not found or not available',
      };
    }

    // Check if user already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return {
        status: 'SUCCESS',
        message: 'You are already enrolled in this course',
        payload: { enrollmentId: existingEnrollment.id },
      };
    }

    // For course products, check if user has purchased
    if (course.product.type === 'COURSE') {
      const purchase = await prisma.purchase.findFirst({
        where: {
          userId: user.id,
          productId: course.productId,
          status: 'COMPLETED',
        },
      });

      if (!purchase) {
        return {
          status: 'ERROR',
          message: 'You need to purchase this course before enrolling',
        };
      }
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId,
        progress: 0,
      },
    });

    // Revalidate relevant pages
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/dashboard');
    revalidatePath('/courses');

    return toActionState('SUCCESS', 'Successfully enrolled in course', {
      enrollmentId: enrollment.id,
      courseId,
    });

  } catch (error) {
    console.error('Enroll in course error:', error);
    return fromErrorToActionState(error, formData);
  }
}

export async function autoEnrollAfterPurchase(
  userId: string,
  courseId: string
): Promise<void> {
  try {
    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return; // Already enrolled
    }

    // Create enrollment
    await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
      },
    });

    console.log(`Auto-enrolled user ${userId} in course ${courseId}`);
  } catch (error) {
    console.error('Auto-enrollment error:', error);
    // Don't throw error to prevent purchase flow from failing
  }
}