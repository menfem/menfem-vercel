// ABOUTME: Constants for analytics configuration and settings
// ABOUTME: Defines tracking settings, event types, and system limits

export const ANALYTICS_CONSTANTS = {
  // Tracking configuration
  DEFAULT_SAMPLE_RATE: 1.0, // Track 100% of events by default
  MAX_EVENT_DATA_SIZE: 10000, // Max size of event data in bytes
  MAX_EVENTS_PER_BATCH: 100,
  BATCH_TIMEOUT: 5000, // 5 seconds

  // Session configuration
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  MAX_SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours

  // Query limits
  MAX_QUERY_RESULTS: 10000,
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 500,

  // Retention periods
  EVENT_RETENTION_DAYS: 365, // Keep events for 1 year
  AGGREGATED_DATA_RETENTION_DAYS: 1095, // Keep aggregated data for 3 years

  // Chart configuration
  DEFAULT_CHART_POINTS: 30,
  MAX_CHART_POINTS: 365,
} as const;

export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  ARTICLE_READ: 'article_read',
  VIDEO_PLAY: 'video_play',
  VIDEO_COMPLETE: 'video_complete',
  COURSE_START: 'course_start',
  COURSE_COMPLETE: 'course_complete',
  LESSON_COMPLETE: 'lesson_complete',
  PURCHASE: 'purchase',
  SUBSCRIPTION_START: 'subscription_start',
  SEARCH: 'search',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  EVENT_RSVP: 'event_rsvp',
  DOWNLOAD: 'download',
  SHARE: 'share',
  FORM_SUBMIT: 'form_submit',
  ERROR: 'error',
  PERFORMANCE: 'performance',
} as const;

export const METRIC_TYPES = {
  VIEW: 'view',
  COMPLETION: 'completion',
  ENGAGEMENT: 'engagement',
  CONVERSION: 'conversion',
  RETENTION: 'retention',
} as const;

export const CONTENT_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  COURSE: 'course',
  PAGE: 'page',
  PRODUCT: 'product',
} as const;

export const TIMEFRAMES = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
  LAST_YEAR: '1y',
} as const;

export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6B7280',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  INDIGO: '#6366F1',
} as const;

// Paths to exclude from tracking
export const EXCLUDED_PATHS = [
  '/api',
  '/admin/api',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/health',
  '/metrics',
] as const;

// Bot user agents to exclude from tracking
export const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
] as const;

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  GOOD_LCP: 2500, // Largest Contentful Paint in ms
  GOOD_FID: 100,  // First Input Delay in ms
  GOOD_CLS: 0.1,  // Cumulative Layout Shift
  SLOW_PAGE_LOAD: 3000, // Page load time in ms
} as const;

// Dashboard metric configurations
export const DASHBOARD_METRICS = {
  REVENUE_GOAL_MONTHLY: 10000, // $100 in cents
  SUBSCRIBER_GOAL_MONTHLY: 50,
  COURSE_ENROLLMENT_GOAL_MONTHLY: 20,
  PAGE_VIEW_GOAL_DAILY: 1000,
} as const;

// Event priority levels for processing
export const EVENT_PRIORITY = {
  HIGH: 'high', // Revenue events, errors
  MEDIUM: 'medium', // User interactions, completions
  LOW: 'low', // Page views, basic tracking
} as const;

// Privacy and compliance
export const PRIVACY_SETTINGS = {
  ANONYMIZE_IP: true,
  RESPECT_DNT: true, // Respect Do Not Track header
  COOKIE_CONSENT_REQUIRED: true,
  DATA_RETENTION_DAYS: 365,
} as const;