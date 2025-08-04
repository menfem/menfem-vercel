// ABOUTME: Server action for updating product categories
// ABOUTME: Handles category updates with slug regeneration if name changes

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { updateProductCategorySchema } from '../schema/product';
import { generateCategorySlug } from '../utils/generate-slug';

export async function updateProductCategory(
  categoryId: string,
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

    const validatedData = updateProductCategorySchema.parse({
      id: categoryId,
      ...rawData,
    });

    // Check if category exists
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return {
        status: 'ERROR',
        message: 'Product category not found',
      };
    }

    // Generate new slug if name changed
    let newSlug = existingCategory.slug;
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      newSlug = await generateCategorySlug(validatedData.name);

      // Check if new slug conflicts with other categories
      const conflictingCategory = await prisma.productCategory.findUnique({
        where: { slug: newSlug },
      });

      if (conflictingCategory && conflictingCategory.id !== categoryId) {
        return {
          status: 'ERROR',
          message: 'A category with this name already exists',
          fieldErrors: {
            name: ['Please choose a different category name'],
          },
        };
      }
    }

    // Update the category
    const category = await prisma.productCategory.update({
      where: { id: categoryId },
      data: {
        name: validatedData.name || existingCategory.name,
        slug: newSlug,
        description: validatedData.description !== undefined 
          ? validatedData.description 
          : existingCategory.description,
      },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/admin/products/categories');
    revalidatePath('/products');

    return toActionState('SUCCESS', 'Product category updated successfully', {
      categoryId: category.id,
      slug: category.slug,
    });

  } catch (error) {
    console.error('Update product category error:', error);
    return fromErrorToActionState(error, formData);
  }
}