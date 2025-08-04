// ABOUTME: Server action for creating course modules
// ABOUTME: Handles module creation with proper ordering

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createCourseModuleSchema } from '../schema/course';

export async function createCourseModule(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      courseId: formData.get('courseId') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
    };

    const validatedData = createCourseModuleSchema.parse(rawData);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
      include: {
        _count: {
          select: {
            modules: true,
          },
        },
      },
    });

    if (!course) {
      return {
        status: 'ERROR',
        message: 'Course not found',
        fieldErrors: {
          courseId: ['Selected course does not exist'],
        },
      };
    }

    // Auto-assign order if not provided
    let moduleOrder = validatedData.order;
    if (moduleOrder === 0) {
      const lastModule = await prisma.courseModule.findFirst({
        where: { courseId: validatedData.courseId },
        orderBy: { order: 'desc' },
      });
      moduleOrder = (lastModule?.order ?? -1) + 1;
    }

    // Check if another module exists with the same order
    const conflictingModule = await prisma.courseModule.findFirst({
      where: {
        courseId: validatedData.courseId,
        order: moduleOrder,
      },
    });

    if (conflictingModule) {
      return {
        status: 'ERROR',
        message: 'A module with this order already exists',
        fieldErrors: {
          order: ['Please choose a different order number'],
        },
      };
    }

    // Create the module
    const module = await prisma.courseModule.create({
      data: {
        ...validatedData,
        order: moduleOrder,
      },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${validatedData.courseId}`);
    revalidatePath(`/courses/${validatedData.courseId}`);

    return toActionState('SUCCESS', 'Course module created successfully', {
      moduleId: module.id,
      courseId: validatedData.courseId,
    });

  } catch (error) {
    console.error('Create course module error:', error);
    return fromErrorToActionState(error, formData);
  }
}