// ABOUTME: Zod validation schemas for video data
// ABOUTME: Handles form validation and data sanitization for video operations

import { z } from 'zod';
import { VIDEO_CONSTANTS } from '../constants';

// YouTube URL validation schema
export const youtubeUrlSchema = z.object({
  youtubeUrl: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (url) => VIDEO_CONSTANTS.YOUTUBE_URL_PATTERNS.some(pattern => pattern.test(url)),
      'Please enter a valid YouTube URL'
    ),
});

// Video creation schema
export const createVideoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(5000, 'Description must be less than 5000 characters'),
  youtubeUrl: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (url) => VIDEO_CONSTANTS.YOUTUBE_URL_PATTERNS.some(pattern => pattern.test(url)),
      'Please enter a valid YouTube URL'
    ),
  seriesId: z.string().optional(),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

// Video update schema (allows partial updates)
export const updateVideoSchema = createVideoSchema.partial().extend({
  id: z.string().cuid(),
});

// Video series creation schema
export const createVideoSeriesSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  thumbnailUrl: z.string().url().optional(),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

// Video series update schema
export const updateVideoSeriesSchema = createVideoSeriesSchema.partial().extend({
  id: z.string().cuid(),
});

// Video search and filter schema
export const videoFiltersSchema = z.object({
  search: z.string().optional(),
  seriesId: z.string().optional(),
  isPremium: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(VIDEO_CONSTANTS.MAX_PAGE_SIZE).default(VIDEO_CONSTANTS.DEFAULT_PAGE_SIZE),
  sortBy: z.enum(['createdAt', 'title', 'viewCount', 'duration']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Video transcript schema
export const videoTranscriptSchema = z.object({
  videoId: z.string().cuid(),
  content: z.string().min(1, 'Transcript content is required'),
  timestamps: z.record(z.string(), z.string()).optional(), // { "00:30": "text at 30 seconds" }
});

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
export type CreateVideoSeriesInput = z.infer<typeof createVideoSeriesSchema>;
export type UpdateVideoSeriesInput = z.infer<typeof updateVideoSeriesSchema>;
export type VideoFiltersInput = z.infer<typeof videoFiltersSchema>;
export type VideoTranscriptInput = z.infer<typeof videoTranscriptSchema>;