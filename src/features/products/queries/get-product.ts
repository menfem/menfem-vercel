// ABOUTME: Query functions for fetching individual products
// ABOUTME: Retrieves single product with all related data

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { ProductWithRelations } from '../types';

export const getProduct = cache(async (id: string): Promise<ProductWithRelations | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      course: true,
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  return product as ProductWithRelations | null;
});

export const getProductBySlug = cache(async (slug: string): Promise<ProductWithRelations | null> => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      course: true,
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  return product as ProductWithRelations | null;
});

export const getActiveProduct = cache(async (id: string): Promise<ProductWithRelations | null> => {
  const product = await prisma.product.findFirst({
    where: { 
      id,
      isActive: true,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      course: true,
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  return product as ProductWithRelations | null;
});

export const getActiveProductBySlug = cache(async (slug: string): Promise<ProductWithRelations | null> => {
  const product = await prisma.product.findFirst({
    where: { 
      slug,
      isActive: true,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      course: true,
      _count: {
        select: {
          purchases: true,
        },
      },
    },
  });

  return product as ProductWithRelations | null;
});

export const getRelatedProducts = cache(async (productId: string, limit: number = 4): Promise<ProductWithRelations[]> => {
  // Get the current product to find related content
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!currentProduct) return [];

  const tagIds = currentProduct.tags.map(t => t.tag.id);

  // Find products with similar tags or same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      AND: [
        { id: { not: productId } }, // Exclude current product
        { isActive: true },
        {
          OR: [
            // Same category
            { categoryId: currentProduct.categoryId },
            // Similar tags
            {
              tags: {
                some: {
                  tagId: { in: tagIds },
                },
              },
            },
          ],
        },
      ],
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      course: true,
      _count: {
        select: {
          purchases: true,
        },
      },
    },
    orderBy: [
      { purchases: { _count: 'desc' } }, // Most popular first
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  return relatedProducts as ProductWithRelations[];
});

export const getUserPurchases = cache(async (userId: string): Promise<ProductWithRelations[]> => {
  const purchases = await prisma.purchase.findMany({
    where: { 
      userId,
      status: 'COMPLETED',
    },
    include: {
      product: {
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          course: true,
          _count: {
            select: {
              purchases: true,
            },
          },
        },
      },
    },
    orderBy: { purchasedAt: 'desc' },
  });

  return purchases.map(p => p.product) as ProductWithRelations[];
});

export const hasUserPurchased = cache(async (userId: string, productId: string): Promise<boolean> => {
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      productId,
      status: 'COMPLETED',
    },
  });

  return !!purchase;
});