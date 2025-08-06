// ABOUTME: Admin article management queries
// ABOUTME: Provides comprehensive article data for admin dashboard

import { prisma } from '@/lib/prisma';

export interface AdminArticlesOptions {
  published?: boolean;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export async function getAdminArticles(options: AdminArticlesOptions = {}) {
  const {
    published,
    search,
    category,
    page = 1,
    limit = 20
  } = options;

  const where: Record<string, unknown> = {};

  // Filter by published status
  if (published !== undefined) {
    where.isPublished = published;
  }

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { subtitle: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { author: { username: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Category filter
  if (category) {
    where.category = { slug: category };
  }

  const offset = (page - 1) * limit;

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true, email: true }
        },
        category: true,
        tags: {
          include: { tag: true }
        },
        _count: {
          select: {
            comments: true,
            savedBy: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.article.count({ where })
  ]);

  return {
    articles,
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      hasNext: page * limit < totalCount,
      hasPrev: page > 1
    }
  };
}

export async function getAdminArticle(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, email: true }
      },
      category: true,
      tags: {
        include: { tag: true }
      },
      comments: {
        include: {
          user: {
            select: { id: true, username: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          comments: true,
          savedBy: true
        }
      }
    }
  });
}

export async function getArticleStats() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    premiumArticles,
    totalViews
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.article.count({ where: { isPublished: false } }),
    prisma.article.count({ where: { isPremium: true } }),
    prisma.article.aggregate({
      _sum: { viewCount: true }
    })
  ]);

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    premiumArticles,
    totalViews: totalViews._sum.viewCount || 0
  };
}