// ABOUTME: Server action for creating new courses
// ABOUTME: Handles course creation with product association

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createCourseSchema } from '../schema/course';

export async function createCourse(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      productId: formData.get('productId') as string,
      syllabus: formData.get('syllabus') as string,
      duration: formData.get('duration') as string,
      level: formData.get('level') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    };

    const validatedData = createCourseSchema.parse(rawData);

    // Check if product exists and is a course type
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return {
        status: 'ERROR',
        message: 'Product not found',
        fieldErrors: {
          productId: ['Selected product does not exist'],
        },
      };
    }

    if (product.type !== 'COURSE') {
      return {
        status: 'ERROR',
        message: 'Product must be of type COURSE',
        fieldErrors: {
          productId: ['Product must be a course type'],
        },
      };
    }

    // Check if course already exists for this product
    const existingCourse = await prisma.course.findUnique({
      where: { productId: validatedData.productId },
    });

    if (existingCourse) {
      return {
        status: 'ERROR',
        message: 'A course already exists for this product',
        fieldErrors: {
          productId: ['This product already has a course'],
        },
      };
    }

    // Create the course
    const course = await prisma.course.create({
      data: validatedData,
    });

    // Revalidate relevant pages
    revalidatePath('/admin/courses');
    revalidatePath('/courses');

    return toActionState('SUCCESS', 'Course created successfully', {
      courseId: course.id,
    });

  } catch (error) {
    console.error('Create course error:', error);
    return fromErrorToActionState(error, formData);
  }
}