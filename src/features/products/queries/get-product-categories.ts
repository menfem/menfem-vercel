// ABOUTME: Query functions for fetching product categories
// ABOUTME: Handles category retrieval with product counts

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getProductCategories = cache(async () => {
  const categories = await prisma.productCategory.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories.map(category => ({
    ...category,
    productCount: category._count.products,
  }));
});

export const getProductCategory = cache(async (categoryId: string) => {
  return prisma.productCategory.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });
});

export const getProductCategoryBySlug = cache(async (slug: string) => {
  return prisma.productCategory.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
  });
});