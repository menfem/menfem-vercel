// ABOUTME: Server action for creating product categories
// ABOUTME: Handles category creation with slug generation and validation

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createProductCategorySchema } from '../schema/product';
import { generateSlug } from '../utils/generate-slug';

export async function createProductCategory(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    };

    const validatedData = createProductCategorySchema.parse(rawData);

    // Generate unique slug
    const slug = await generateSlug(validatedData.name);

    // Check if category with this name or slug already exists
    const existingCategory = await prisma.productCategory.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      return {
        status: 'ERROR',
        message: 'A category with this name already exists',
        fieldErrors: {
          name: ['Please choose a different category name'],
        },
      };
    }

    // Create the category
    const category = await prisma.productCategory.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
      },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/admin/products/categories');
    revalidatePath('/products');

    return toActionState('SUCCESS', 'Product category created successfully', {
      categoryId: category.id,
      slug: category.slug,
    });

  } catch (error) {
    console.error('Create product category error:', error);
    return fromErrorToActionState(error, formData);
  }
}