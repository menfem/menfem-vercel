// ABOUTME: Client-side event tracking service
// ABOUTME: Handles event collection, batching, and transmission to analytics API

'use client';

import { ANALYTICS_CONSTANTS, EVENT_TYPES, EXCLUDED_PATHS, BOT_USER_AGENTS } from '../constants';
import type { 
  TrackableEventType, 
  PageViewEvent, 
  ArticleReadEvent, 
  VideoEvent, 
  CourseEvent, 
  PurchaseEvent,
  SearchEvent 
} from '../types';

interface QueuedEvent {
  eventType: TrackableEventType;
  eventData: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  path: string;
  userAgent: string;
}

export class EventTracker {
  private static instance: EventTracker;
  private sessionId: string;
  private eventQueue: QueuedEvent[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private isEnabled: boolean = true;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracker();
  }

  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker();
    }
    return EventTracker.instance;
  }

  private initializeTracker() {
    // Check if tracking should be disabled
    if (this.shouldDisableTracking()) {
      this.isEnabled = false;
      return;
    }

    // Set up page visibility change listener to flush events
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });

      // Set up beforeunload listener to flush events
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }

    // Start automatic page view tracking
    this.trackPageView();
  }

  private shouldDisableTracking(): boolean {
    if (typeof window === 'undefined') return true;

    // Check Do Not Track header
    if (navigator.doNotTrack === '1') return true;

    // Check for bot user agents
    const userAgent = navigator.userAgent.toLowerCase();
    if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) return true;

    // Check for excluded paths
    const path = window.location.pathname;
    if (EXCLUDED_PATHS.some(excludedPath => path.startsWith(excludedPath))) return true;

    // Check for local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return process.env.NODE_ENV !== 'development' || !process.env.ENABLE_DEV_ANALYTICS;
    }

    return false;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async track(eventType: TrackableEventType, eventData: Record<string, unknown> = {}) {
    if (!this.isEnabled) return;

    try {
      const event: QueuedEvent = {
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      };

      this.eventQueue.push(event);

      // If queue is full, flush immediately
      if (this.eventQueue.length >= ANALYTICS_CONSTANTS.MAX_EVENTS_PER_BATCH) {
        this.flush();
      } else {
        // Schedule batch processing
        this.scheduleBatch();
      }
    } catch (error) {
      console.error('Event tracking failed:', error);
    }
  }

  private scheduleBatch() {
    if (this.batchTimeout) return;

    this.batchTimeout = setTimeout(() => {
      this.flush();
    }, ANALYTICS_CONSTANTS.BATCH_TIMEOUT);
  }

  private async flush() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend }),
        keepalive: true, // Important for tracking during page unload
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure (with some limit to prevent infinite growth)
      if (this.eventQueue.length < ANALYTICS_CONSTANTS.MAX_EVENTS_PER_BATCH) {
        this.eventQueue.unshift(...eventsToSend.slice(-10)); // Keep last 10 events
      }
    }
  }

  // Public tracking methods
  trackPageView(data?: Partial<PageViewEvent>) {
    if (typeof window === 'undefined') return;

    this.track(EVENT_TYPES.PAGE_VIEW, {
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      title: document.title,
      ...data,
    });
  }

  trackArticleRead(data: ArticleReadEvent) {
    this.track(EVENT_TYPES.ARTICLE_READ, data as unknown as Record<string, unknown>);
  }

  trackVideoPlay(data: VideoEvent) {
    this.track(EVENT_TYPES.VIDEO_PLAY, data as unknown as Record<string, unknown>);
  }

  trackVideoComplete(data: VideoEvent) {
    this.track(EVENT_TYPES.VIDEO_COMPLETE, data as unknown as Record<string, unknown>);
  }

  trackCourseStart(data: CourseEvent) {
    this.track(EVENT_TYPES.COURSE_START, data as unknown as Record<string, unknown>);
  }

  trackCourseComplete(data: CourseEvent) {
    this.track(EVENT_TYPES.COURSE_COMPLETE, data as unknown as Record<string, unknown>);
  }

  trackLessonComplete(data: CourseEvent) {
    this.track(EVENT_TYPES.LESSON_COMPLETE, data as unknown as Record<string, unknown>);
  }

  trackPurchase(data: PurchaseEvent) {
    this.track(EVENT_TYPES.PURCHASE, data as unknown as Record<string, unknown>);
  }

  trackSubscriptionStart(data: { planType: string; amount: number }) {
    this.track(EVENT_TYPES.SUBSCRIPTION_START, data);
  }

  trackSearch(data: SearchEvent) {
    this.track(EVENT_TYPES.SEARCH, data as unknown as Record<string, unknown>);
  }

  trackNewsletterSignup(data: { source?: string }) {
    this.track(EVENT_TYPES.NEWSLETTER_SIGNUP, data);
  }

  trackEventRSVP(data: { eventId: string; eventTitle: string }) {
    this.track(EVENT_TYPES.EVENT_RSVP, data);
  }

  trackDownload(data: { fileName: string; fileType: string; fileSize?: number }) {
    this.track(EVENT_TYPES.DOWNLOAD, data);
  }

  trackShare(data: { contentType: string; contentId: string; platform: string }) {
    this.track(EVENT_TYPES.SHARE, data);
  }

  trackError(data: { message: string; stack?: string; component?: string }) {
    this.track(EVENT_TYPES.ERROR, data);
  }

  trackPerformance(data: { 
    lcp?: number; 
    fid?: number; 
    cls?: number; 
    pageLoadTime?: number;
  }) {
    this.track(EVENT_TYPES.PERFORMANCE, data);
  }

  // Custom event tracking
  trackCustomEvent(eventType: string, data: Record<string, unknown>) {
    this.track(eventType as TrackableEventType, data);
  }

  // Utility methods
  getSessionId(): string {
    return this.sessionId;
  }

  isTrackingEnabled(): boolean {
    return this.isEnabled;
  }

  // Force flush events (useful for testing or immediate processing)
  forceFlush(): Promise<void> {
    return this.flush();
  }

  // Disable tracking (for privacy compliance)
  disable() {
    this.isEnabled = false;
    this.eventQueue = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  // Re-enable tracking
  enable() {
    if (this.shouldDisableTracking()) return;
    this.isEnabled = true;
    this.sessionId = this.generateSessionId();
  }
}

// Export singleton instance
export const eventTracker = EventTracker.getInstance();