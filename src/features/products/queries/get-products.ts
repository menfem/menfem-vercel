// ABOUTME: Query functions for fetching paginated product lists
// ABOUTME: Handles filtering, sorting, and pagination for product collections

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { ProductWithRelations, PaginatedProducts, ProductFilters } from '../types';
import { PRODUCT_CONSTANTS } from '../constants';

export const getProducts = cache(async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
  const {
    search,
    categoryId,
    type,
    isActive = true,
    priceMin,
    priceMax,
    tags = [],
  } = filters;

  // Default pagination
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(filters.limit || PRODUCT_CONSTANTS.DEFAULT_PAGE_SIZE, PRODUCT_CONSTANTS.MAX_PAGE_SIZE);
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    isActive,
  };

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { shortDesc: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Type filter
  if (type) {
    where.type = type;
  }

  // Price range filter
  if (priceMin !== undefined || priceMax !== undefined) {
    where.price = {};
    if (priceMin !== undefined) {
      where.price.gte = priceMin;
    }
    if (priceMax !== undefined) {
      where.price.lte = priceMax;
    }
  }

  // Tags filter
  if (tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          slug: { in: tags },
        },
      },
    };
  }

  // Default sorting
  const orderBy = { createdAt: 'desc' as const };

  // Execute queries in parallel
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
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
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    list: products as ProductWithRelations[],
    metadata: {
      count: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
});

export const getActiveProducts = cache(async (filters: Omit<ProductFilters, 'isActive'> = {}) => {
  return getProducts({ ...filters, isActive: true });
});

export const getProductsByType = cache(async (type: string, filters: Omit<ProductFilters, 'type'> = {}) => {
  return getProducts({ ...filters, type: type as any });
});

export const getCourseProducts = cache(async (filters: Omit<ProductFilters, 'type'> = {}) => {
  return getProducts({ ...filters, type: 'COURSE' });
});

export const getDigitalProducts = cache(async (filters: Omit<ProductFilters, 'type'> = {}) => {
  return getProducts({ ...filters, type: 'DIGITAL' });
});

export const getPhysicalProducts = cache(async (filters: Omit<ProductFilters, 'type'> = {}) => {
  return getProducts({ ...filters, type: 'PHYSICAL' });
});

export const getProductsByCategory = cache(async (categoryId: string, filters: Omit<ProductFilters, 'categoryId'> = {}) => {
  return getProducts({ ...filters, categoryId });
});

export const getProductsByTag = cache(async (tagSlug: string, filters: Omit<ProductFilters, 'tags'> = {}) => {
  return getProducts({ ...filters, tags: [tagSlug] });
});

export const getFeaturedProducts = cache(async (limit: number = 8): Promise<ProductWithRelations[]> => {
  const products = await prisma.product.findMany({
    where: { 
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
    orderBy: [
      { purchases: { _count: 'desc' } }, // Most purchased first
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  return products as ProductWithRelations[];
});