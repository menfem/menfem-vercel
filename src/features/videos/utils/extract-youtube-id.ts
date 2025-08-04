// ABOUTME: Utility function to extract YouTube video ID from various URL formats
// ABOUTME: Handles different YouTube URL patterns and returns the video ID

import { VIDEO_CONSTANTS } from '../constants';

/**
 * Extracts YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  try {
    for (const pattern of VIDEO_CONSTANTS.YOUTUBE_URL_PATTERNS) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting YouTube ID:', error);
    return null;
  }
}

/**
 * Validates if a string is a valid YouTube video ID
 * YouTube video IDs are 11 characters long and contain alphanumeric characters, underscores, and hyphens
 */
export function isValidYouTubeId(id: string): boolean {
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  return youtubeIdPattern.test(id);
}

/**
 * Generates various YouTube URLs from a video ID
 */
export function generateYouTubeUrls(videoId: string) {
  if (!isValidYouTubeId(videoId)) {
    throw new Error('Invalid YouTube video ID');
  }

  return {
    watch: `https://www.youtube.com/watch?v=${videoId}`,
    embed: `https://www.youtube.com/embed/${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    thumbnailMQ: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    thumbnailSD: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
  };
}