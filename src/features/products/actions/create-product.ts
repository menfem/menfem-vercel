// ABOUTME: Server action for creating new products
// ABOUTME: Handles product creation with categories and image uploads

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createProductSchema } from '../schema/product';
import { generateSlug } from '../utils/generate-slug';

export async function createProduct(
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

    const validatedData = createProductSchema.parse(rawData);

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

    // Generate unique slug
    const slug = await generateSlug(validatedData.name);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return {
        status: 'ERROR',
        message: 'A product with this name already exists',
        fieldErrors: {
          name: ['Please choose a different product name'],
        },
      };
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

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug,
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

    // Revalidate relevant pages
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${slug}`);

    return toActionState('SUCCESS', 'Product created successfully', {
      productId: product.id,
      slug: product.slug,
    });

  } catch (error) {
    console.error('Create product error:', error);
    return fromErrorToActionState(error, formData);
  }
}