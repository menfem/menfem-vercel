// ABOUTME: Server action for updating existing products
// ABOUTME: Handles product updates with validation and slug regeneration

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { updateProductSchema } from '../schema/product';
import { generateSlug } from '../utils/generate-slug';

export async function updateProduct(
  productId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check admin permissions
    await getAdminOrRedirect();

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDesc: formData.get('shortDesc') as string || undefined,
      categoryId: formData.get('categoryId') as string,
      price: parseInt(formData.get('price') as string) || 0,
      comparePrice: parseInt(formData.get('comparePrice') as string) || undefined,
      type: formData.get('type') as 'PHYSICAL' | 'DIGITAL' | 'COURSE' | 'SUBSCRIPTION',
      isActive: formData.get('isActive') === 'true',
      isDigital: formData.get('isDigital') === 'true',
      stock: formData.get('stock') ? parseInt(formData.get('stock') as string) : undefined,
      images: formData.getAll('images') as string[],
      tags: formData.getAll('tags') as string[],
    };

    const validatedData = updateProductSchema.parse(rawData);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        tags: true,
      },
    });

    if (!existingProduct) {
      return {
        status: 'ERROR',
        message: 'Product not found',
      };
    }

    // Check if category exists
    const category = await prisma.productCategory.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return {
        status: 'ERROR',
        message: 'Product category not found',
        fieldErrors: {
          categoryId: ['Selected category does not exist'],
        },
      };
    }

    // Generate new slug if name changed
    let newSlug = existingProduct.slug;
    if (validatedData.name !== existingProduct.name) {
      newSlug = await generateSlug(validatedData.name);

      // Check if new slug conflicts with other products
      const conflictingProduct = await prisma.product.findUnique({
        where: { slug: newSlug },
      });

      if (conflictingProduct && conflictingProduct.id !== productId) {
        return {
          status: 'ERROR',
          message: 'A product with this name already exists',
          fieldErrors: {
            name: ['Please choose a different product name'],
          },
        };
      }
    }

    // Validate tags exist
    if (validatedData.tags && validatedData.tags.length > 0) {
      const tagCount = await prisma.tag.count({
        where: { id: { in: validatedData.tags } },
      });

      if (tagCount !== validatedData.tags.length) {
        return {
          status: 'ERROR',
          message: 'One or more selected tags do not exist',
          fieldErrors: {
            tags: ['Invalid tag selection'],
          },
        };
      }
    }

    // Update the product
    const product = await prisma.$transaction(async (tx) => {
      // Remove existing tags
      await tx.productTag.deleteMany({
        where: { productId },
      });

      // Update product with new data
      return await tx.product.update({
        where: { id: productId },
        data: {
          name: validatedData.name,
          slug: newSlug,
          description: validatedData.description,
          shortDesc: validatedData.shortDesc,
          categoryId: validatedData.categoryId,
          price: validatedData.price,
          comparePrice: validatedData.comparePrice,
          type: validatedData.type,
          isActive: validatedData.isActive,
          isDigital: validatedData.isDigital,
          stock: validatedData.stock,
          images: validatedData.images || [],
          tags: validatedData.tags ? {
            create: validatedData.tags.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          } : undefined,
        },
      });
    });

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${existingProduct.slug}`);
    if (newSlug !== existingProduct.slug) {
      revalidatePath(`/products/${newSlug}`);
    }

    return toActionState('SUCCESS', 'Product updated successfully', {
      productId: product.id,
      slug: product.slug,
    });

  } catch (error) {
    console.error('Update product error:', error);
    return fromErrorToActionState(error, formData);
  }
}