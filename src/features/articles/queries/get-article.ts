// ABOUTME: Query function for fetching a single article by ID or slug
// ABOUTME: Includes related data and increments view count for published articles

import { prisma } from '@/lib/prisma';
import type { ArticleWithRelations } from '../types';

export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
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
  });

  // Increment view count for published articles
  if (article && article.isPublished) {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return article;
}

export async function getArticleById(id: string): Promise<ArticleWithRelations | null> {
  return prisma.article.findUnique({
    where: { id },
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
  });
}