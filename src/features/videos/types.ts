// ABOUTME: TypeScript type definitions for the videos feature
// ABOUTME: Defines interfaces and types used across the video module

import type { Video, VideoSeries, VideoTag, VideoTranscript, Tag } from '@prisma/client';

export type VideoWithRelations = Video & {
  series?: VideoSeries | null;
  tags: Array<VideoTag & {
    tag: Tag;
  }>;
  transcripts?: VideoTranscript[];
  _count?: {
    lessons: number;
  };
};

export type VideoSeriesWithVideos = VideoSeries & {
  videos: VideoWithRelations[];
  _count: {
    videos: number;
  };
};

export type VideoListItem = VideoWithRelations;

export type PaginatedVideos = {
  list: VideoListItem[];
  metadata: {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type YouTubeMetadata = {
  title: string;
  description: string;
  thumbnailUrl: string;
  duration?: number; // in seconds
};

export type VideoFilters = {
  search?: string;
  seriesId?: string;
  isPremium?: boolean;
  isPublished?: boolean;
  tags?: string[];
  excludeIds?: string[];
  page?: number;
  limit?: number;
};

export type VideoFormData = {
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeId?: string;
  seriesId?: string;
  isPremium: boolean;
  isPublished: boolean;
  tags: string[];
};