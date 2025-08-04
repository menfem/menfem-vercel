// ABOUTME: Constants and configuration for the videos feature
// ABOUTME: Centralized constants for video management and display

export const VIDEO_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // YouTube
  YOUTUBE_URL_PATTERNS: [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ],
  
  // Video duration limits (in seconds)
  MIN_DURATION: 60, // 1 minute
  MAX_DURATION: 7200, // 2 hours
  
  // Default thumbnail dimensions
  THUMBNAIL: {
    WIDTH: 480,
    HEIGHT: 360,
  },
  
  // Video player settings
  PLAYER: {
    DEFAULT_WIDTH: '100%',
    DEFAULT_HEIGHT: 'auto',
    ASPECT_RATIO: '16:9',
  },
} as const;

export const VIDEO_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'viewCount_desc', label: 'Most Viewed' },
  { value: 'duration_asc', label: 'Shortest First' },
  { value: 'duration_desc', label: 'Longest First' },
] as const;

export const VIDEO_FILTER_OPTIONS = {
  PREMIUM: [
    { value: 'all', label: 'All Videos' },
    { value: 'free', label: 'Free Videos' },
    { value: 'premium', label: 'Premium Only' },
  ],
  PUBLISHED: [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ],
} as const;

export const YOUTUBE_EMBED_PARAMS = {
  // Remove related videos from other channels
  rel: 0,
  // Hide YouTube branding
  modestbranding: 1,
  // Hide video controls initially
  controls: 1,
  // Disable fullscreen button
  fs: 1,
  // Auto-hide controls after 3 seconds
  autohide: 1,
} as const;