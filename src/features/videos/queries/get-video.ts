// ABOUTME: Query functions for fetching individual videos
// ABOUTME: Retrieves single video with all related data including transcripts

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { VideoWithRelations } from '../types';

export const getVideo = cache(async (id: string): Promise<VideoWithRelations | null> => {
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      series: true,
      tags: {
        include: {
          tag: true,
        },
      },
      transcripts: true,
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  // Increment view count
  if (video && video.isPublished) {
    await prisma.video.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  return video as VideoWithRelations | null;
});

export const getVideoByYouTubeId = cache(async (youtubeId: string): Promise<VideoWithRelations | null> => {
  const video = await prisma.video.findUnique({
    where: { youtubeId },
    include: {
      series: true,
      tags: {
        include: {
          tag: true,
        },
      },
      transcripts: true,
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  return video as VideoWithRelations | null;
});

export const getVideoForEdit = cache(async (id: string): Promise<VideoWithRelations | null> => {
  // Admin function - don't increment view count
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      series: true,
      tags: {
        include: {
          tag: true,
        },
      },
      transcripts: true,
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  return video as VideoWithRelations | null;
});

export const getRelatedVideos = cache(async (videoId: string, limit: number = 6): Promise<VideoWithRelations[]> => {
  // Get the current video to find related content
  const currentVideo = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!currentVideo) return [];

  const tagIds = currentVideo.tags.map(t => t.tag.id);

  // Find videos with similar tags or same series
  const relatedVideos = await prisma.video.findMany({
    where: {
      AND: [
        { id: { not: videoId } }, // Exclude current video
        { isPublished: true },
        {
          OR: [
            // Same series
            { seriesId: currentVideo.seriesId },
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
    orderBy: [
      { viewCount: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  return relatedVideos as VideoWithRelations[];
});