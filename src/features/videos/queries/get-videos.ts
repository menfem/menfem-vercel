// ABOUTME: Query functions for fetching paginated video lists
// ABOUTME: Handles filtering, sorting, and pagination for video collections

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { VideoWithRelations, PaginatedVideos, VideoFilters } from '../types';
import { VIDEO_CONSTANTS } from '../constants';

export const getVideos = cache(async (filters: VideoFilters = {}): Promise<PaginatedVideos> => {
  const {
    search,
    seriesId,
    isPremium,
    isPublished = true,
    tags = [],
    excludeIds = [],
  } = filters;

  // Default pagination
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(filters.limit || VIDEO_CONSTANTS.DEFAULT_PAGE_SIZE, VIDEO_CONSTANTS.MAX_PAGE_SIZE);
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    isPublished,
  };

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Series filter
  if (seriesId) {
    where.seriesId = seriesId;
  }

  // Premium filter
  if (typeof isPremium === 'boolean') {
    where.isPremium = isPremium;
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

  // Exclude specific videos
  if (excludeIds.length > 0) {
    where.id = {
      notIn: excludeIds,
    };
  }

  // Default sorting
  const orderBy = { createdAt: 'desc' as const };

  // Execute queries in parallel
  const [videos, totalCount] = await Promise.all([
    prisma.video.findMany({
      where,
      include: {
        series: true,
        tags: {
          include: {
            tag: true,
          },
        },
        transcripts: false, // Don't include transcripts in list view
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.video.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    list: videos as VideoWithRelations[],
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

export const getPublishedVideos = cache(async (filters: Omit<VideoFilters, 'isPublished'> = {}) => {
  return getVideos({ ...filters, isPublished: true });
});

export const getPremiumVideos = cache(async (filters: Omit<VideoFilters, 'isPremium'> = {}) => {
  return getVideos({ ...filters, isPremium: true });
});

export const getFreeVideos = cache(async (filters: Omit<VideoFilters, 'isPremium'> = {}) => {
  return getVideos({ ...filters, isPremium: false });
});

export const getVideosByTag = cache(async (tagSlug: string, filters: Omit<VideoFilters, 'tags'> = {}) => {
  return getVideos({ ...filters, tags: [tagSlug] });
});

export const getVideosBySeries = cache(async (seriesId: string, filters: Omit<VideoFilters, 'seriesId'> = {}) => {
  return getVideos({ ...filters, seriesId });
});