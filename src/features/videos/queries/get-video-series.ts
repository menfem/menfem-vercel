// ABOUTME: Query functions for fetching video series and collections
// ABOUTME: Handles video series with their associated videos

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { VideoSeriesWithVideos } from '../types';

export const getVideoSeries = cache(async (id: string): Promise<VideoSeriesWithVideos | null> => {
  const series = await prisma.videoSeries.findUnique({
    where: { id },
    include: {
      videos: {
        where: { isPublished: true },
        include: {
          series: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' }, // Chronological order within series
      },
      _count: {
        select: {
          videos: {
            where: { isPublished: true },
          },
        },
      },
    },
  });

  return series as VideoSeriesWithVideos | null;
});

export const getAllVideoSeries = cache(async (): Promise<VideoSeriesWithVideos[]> => {
  const series = await prisma.videoSeries.findMany({
    where: { isPublished: true },
    include: {
      videos: {
        where: { isPublished: true },
        include: {
          series: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 5, // Limit videos per series in list view
      },
      _count: {
        select: {
          videos: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return series as VideoSeriesWithVideos[];
});

export const getVideoSeriesForAdmin = cache(async (): Promise<VideoSeriesWithVideos[]> => {
  const series = await prisma.videoSeries.findMany({
    include: {
      videos: {
        include: {
          series: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: {
          videos: true, // Include all videos for admin
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return series as VideoSeriesWithVideos[];
});

export const getFeaturedVideoSeries = cache(async (limit: number = 3): Promise<VideoSeriesWithVideos[]> => {
  const series = await prisma.videoSeries.findMany({
    where: { 
      isPublished: true,
      videos: {
        some: { isPublished: true },
      },
    },
    include: {
      videos: {
        where: { isPublished: true },
        include: {
          series: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 3, // Show first 3 videos as preview
      },
      _count: {
        select: {
          videos: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  return series as VideoSeriesWithVideos[];
});