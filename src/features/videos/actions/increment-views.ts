// ABOUTME: Server action to increment video view count
// ABOUTME: Updates view statistics for analytics and display purposes

'use server';

import { prisma } from '@/lib/prisma';

export async function incrementVideoViews(videoId: string) {
  try {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    // Silently fail to not disrupt video viewing experience
    console.error('Failed to increment video views:', error);
  }
}