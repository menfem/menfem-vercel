// ABOUTME: Query functions for fetching articles with pagination and filters
// ABOUTME: Provides type-safe article retrieval with metadata

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { PaginatedArticles } from '../types';

export type GetArticlesOptions = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  isPremium?: boolean;
  authorId?: string;
  orderBy?: 'createdAt' | 'publishedAt' | 'viewCount';
  orderDirection?: 'asc' | 'desc';
};

// Create a cache key from options for React cache
const createCacheKey = (options: GetArticlesOptions) => {
  return JSON.stringify(options);
};

export const getArticles = cache(async (options: GetArticlesOptions = {}): Promise<PaginatedArticles> => {
  const {
    page = 1,
    limit = 10,
    categorySlug,
    tagSlug,
    search,
    isPremium,
    authorId,
    orderBy = 'publishedAt',
    orderDirection = 'desc',
  } = options;

  const where: Prisma.ArticleWhereInput = {
    isPublished: true,
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
    ...(tagSlug && {
      tags: {
        some: { tag: { slug: tagSlug } },
      },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(isPremium !== undefined && { isPremium }),
    ...(authorId && { authorId }),
  };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderBy]: orderDirection },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: true,
        tags: {
          include: { tag: true },
        },
        _count: {
          select: {
            comments: true,
            savedBy: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    list: articles,
    metadata: {
      count: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: totalCount > page * limit,
      hasPreviousPage: page > 1,
    },
  };
});