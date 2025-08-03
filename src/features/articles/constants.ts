// ABOUTME: Constants and configuration for articles feature
// ABOUTME: Defines limits, defaults, and other constants used across articles

export const ARTICLES_PER_PAGE = 10;
export const MAX_TITLE_LENGTH = 255;
export const MAX_EXCERPT_LENGTH = 500;
export const DEFAULT_READING_TIME = 5;

export const ARTICLE_SORT_OPTIONS = [
  { value: 'publishedAt_desc', label: 'Newest First' },
  { value: 'publishedAt_asc', label: 'Oldest First' },
  { value: 'viewCount_desc', label: 'Most Popular' },
  { value: 'createdAt_desc', label: 'Recently Created' },
] as const;

export const ARTICLE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Articles' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'premium', label: 'Premium Only' },
] as const;