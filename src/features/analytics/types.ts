// ABOUTME: TypeScript type definitions for analytics features
// ABOUTME: Defines interfaces for events, metrics, and dashboard data

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId?: string;
  eventType: string;
  eventData: Record<string, unknown>;
  path?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface ContentMetric {
  id: string;
  contentType: 'article' | 'video' | 'course';
  contentId: string;
  metricType: 'view' | 'completion' | 'engagement';
  value: number;
  date: Date;
}

export interface RevenueMetric {
  id: string;
  date: Date;
  revenue: number; // in cents
  subscriptions: number;
  coursesSold: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  activeSubscribers: number;
  subscriberChange: number;
  courseEnrollments: number;
  enrollmentChange: number;
  pageViews: number;
  pageViewChange: number;
  revenueData: RevenueChartData[];
  contentData: ContentMetricsData[];
  userMetrics: UserMetricsData;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  subscriptions: number;
  courses: number;
}

export interface ContentMetricsData {
  contentType: string;
  contentTitle: string;
  views: number;
  completions: number;
  engagement: number;
}

export interface UserMetricsData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  retentionRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
}

export interface TrackingConfig {
  enableTracking: boolean;
  sampleRate: number;
  excludePaths: string[];
  trackAnonymous: boolean;
}

export interface EventFilters {
  eventType?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface MetricsTimeframe {
  period: '7d' | '30d' | '90d' | '1y';
  startDate: Date;
  endDate: Date;
}

// Event tracking types
export type TrackableEventType = 
  | 'page_view'
  | 'article_read'
  | 'video_play'
  | 'video_complete'
  | 'course_start'
  | 'course_complete'
  | 'lesson_complete'
  | 'purchase'
  | 'subscription_start'
  | 'search'
  | 'newsletter_signup'
  | 'event_rsvp'
  | 'download'
  | 'share';

export interface PageViewEvent {
  path: string;
  referrer?: string;
  duration?: number;
}

export interface ArticleReadEvent {
  articleId: string;
  articleTitle: string;
  readingTime: number;
  scrollDepth: number;
}

export interface VideoEvent {
  videoId: string;
  videoTitle: string;
  duration?: number;
  watchTime?: number;
}

export interface CourseEvent {
  courseId: string;
  courseTitle: string;
  moduleId?: string;
  lessonId?: string;
}

export interface PurchaseEvent {
  productId: string;
  productType: string;
  amount: number;
  currency: string;
}

export interface SearchEvent {
  query: string;
  resultsCount: number;
  clickedResult?: string;
}

// Analytics query options
export interface AnalyticsQueryOptions {
  timeframe?: MetricsTimeframe;
  groupBy?: 'day' | 'week' | 'month';
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  category: string;
  value: number;
  [key: string]: string | number;
}

// Admin analytics types
export interface AdminAnalyticsFilters {
  period: '7d' | '30d' | '90d' | '1y';
  contentType?: 'article' | 'video' | 'course';
  eventType?: TrackableEventType;
  userId?: string;
}

export interface ContentPerformance {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course';
  views: number;
  uniqueViews: number;
  completions: number;
  averageEngagementTime: number;
  conversionRate: number;
}

export interface UserBehaviorMetrics {
  averageSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  returnVisitorRate: number;
  mostViewedContent: ContentPerformance[];
  userJourney: Array<{
    step: string;
    users: number;
    dropoffRate: number;
  }>;
}