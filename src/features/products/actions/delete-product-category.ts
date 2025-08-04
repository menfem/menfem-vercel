// ABOUTME: Server action for deleting product categories
// ABOUTME: Prevents deletion of categories with associated products

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';

export async function deleteProductCategory(
  categoryId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if category exists
    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return {
        status: 'ERROR',
        message: 'Product category not found',
      };
    }

    // Check if category has any products
    if (category._count.products > 0) {
      return {
        status: 'ERROR',
        message: `Cannot delete category with ${category._count.products} associated products. Please move or delete the products first.`,
      };
    }

    // Delete the category
    await prisma.productCategory.delete({
      where: { id: categoryId },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/admin/products/categories');
    revalidatePath('/products');

    return toActionState('SUCCESS', 'Product category deleted successfully');

  } catch (error) {
    console.error('Delete product category error:', error);
    return fromErrorToActionState(error, formData);
  }
}