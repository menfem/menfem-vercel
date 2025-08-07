// ABOUTME: YouTube Data API integration service
// ABOUTME: Fetches video metadata and handles API rate limiting

import { z } from 'zod';
import { parseISO8601Duration } from '../utils/format-duration';
import type { YouTubeMetadata } from '../types';

// YouTube API response schema
const youtubeVideoSchema = z.object({
  id: z.string(),
  snippet: z.object({
    title: z.string(),
    description: z.string(),
    thumbnails: z.object({
      maxres: z
        .object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        })
        .optional(),
      high: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
      medium: z
        .object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        })
        .optional(),
    }),
    publishedAt: z.string(),
    channelTitle: z.string(),
  }),
  contentDetails: z.object({
    duration: z.string(), // ISO 8601 format like "PT4M13S"
  }),
  statistics: z
    .object({
      viewCount: z.string(),
      likeCount: z.string().optional(),
      commentCount: z.string().optional(),
    })
    .optional(),
});

const youtubeApiResponseSchema = z.object({
  items: z.array(youtubeVideoSchema),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
});

/**
 * Fetches video metadata from YouTube Data API
 */
export async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata> {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'snippet,contentDetails,statistics');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', process.env.YOUTUBE_API_KEY);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube API error:', response.status, errorText);
      
      if (response.status === 403) {
        throw new Error('YouTube API quota exceeded or invalid API key');
      }
      
      if (response.status === 404) {
        throw new Error('Video not found or is private');
      }
      
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = youtubeApiResponseSchema.parse(data);

    if (validatedData.items.length === 0) {
      throw new Error('Video not found or is private');
    }

    const video = validatedData.items[0];
    
    // Get the best quality thumbnail available
    const thumbnail = 
      video.snippet.thumbnails.maxres?.url ||
      video.snippet.thumbnails.high.url ||
      video.snippet.thumbnails.medium?.url ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: thumbnail,
      duration: parseISO8601Duration(video.contentDetails.duration),
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    
    if (error instanceof z.ZodError) {
      console.error('YouTube API response validation error:', error.issues);
      throw new Error('Invalid response from YouTube API');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to fetch video metadata from YouTube');
  }
}

/**
 * Validates if a YouTube video exists and is accessible
 */
export async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  try {
    await fetchYouTubeMetadata(videoId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetches basic video info for multiple videos at once
 * Limited to 50 videos per request by YouTube API
 */
export async function fetchMultipleVideoMetadata(videoIds: string[]): Promise<Record<string, YouTubeMetadata>> {
  if (videoIds.length === 0) return {};
  
  if (videoIds.length > 50) {
    throw new Error('Cannot fetch more than 50 videos at once');
  }

  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'snippet,contentDetails');
    url.searchParams.append('id', videoIds.join(','));
    url.searchParams.append('key', process.env.YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = youtubeApiResponseSchema.parse(data);

    const result: Record<string, YouTubeMetadata> = {};
    
    for (const video of validatedData.items) {
      const thumbnail = 
        video.snippet.thumbnails.maxres?.url ||
        video.snippet.thumbnails.high.url ||
        `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

      result[video.id] = {
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: thumbnail,
        duration: parseISO8601Duration(video.contentDetails.duration),
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching multiple YouTube metadata:', error);
    throw new Error('Failed to fetch video metadata from YouTube');
  }
}