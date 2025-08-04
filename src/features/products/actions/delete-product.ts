// ABOUTME: Server action for deleting products
// ABOUTME: Handles product deletion with safety checks for purchases and courses

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';

export async function deleteProduct(
  productId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        purchases: true,
        course: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!product) {
      return {
        status: 'ERROR',
        message: 'Product not found',
      };
    }

    // Check if product has any purchases
    if (product._count.purchases > 0) {
      return {
        status: 'ERROR',
        message: 'Cannot delete product with existing purchases. Consider deactivating instead.',
      };
    }

    // Check if product has an associated course with enrollments
    if (product.course) {
      const enrollmentCount = await prisma.courseEnrollment.count({
        where: { courseId: product.course.id },
      });

      if (enrollmentCount > 0) {
        return {
          status: 'ERROR',
          message: 'Cannot delete course product with active enrollments. Consider deactivating instead.',
        };
      }
    }

    // Delete the product (cascades will handle related records)
    await prisma.$transaction(async (tx) => {
      // Delete product tags
      await tx.productTag.deleteMany({
        where: { productId },
      });

      // Delete associated course if exists
      if (product.course) {
        await tx.course.delete({
          where: { id: product.course.id },
        });
      }

      // Delete the product
      await tx.product.delete({
        where: { id: productId },
      });
    });

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);

    return toActionState('SUCCESS', 'Product deleted successfully');

  } catch (error) {
    console.error('Delete product error:', error);
    return fromErrorToActionState(error, formData);
  }
}

export async function deactivateProduct(
  productId: string,
  prevState?: ActionState,
  formData?: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        status: 'ERROR',
        message: 'Product not found',
      };
    }

    // Deactivate instead of delete
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);

    return toActionState('SUCCESS', 'Product deactivated successfully', {
      productId: updatedProduct.id,
    });

  } catch (error) {
    console.error('Deactivate product error:', error);
    return fromErrorToActionState(error, formData);
  }
}