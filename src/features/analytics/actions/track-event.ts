// ABOUTME: Server action for recording analytics events
// ABOUTME: Handles event validation, processing, and storage

'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';
import { ANALYTICS_CONSTANTS, EVENT_TYPES } from '../constants';
import type { TrackableEventType } from '../types';

interface TrackEventData {
  eventType: TrackableEventType;
  eventData: Record<string, unknown>;
  sessionId: string;
  path: string;
  userAgent: string;
  timestamp?: string;
}

export async function trackEvent(data: TrackEventData) {
  try {
    // Validate event data size
    const eventDataString = JSON.stringify(data.eventData);
    if (eventDataString.length > ANALYTICS_CONSTANTS.MAX_EVENT_DATA_SIZE) {
      console.error('Event data too large:', eventDataString.length);
      return { success: false, error: 'Event data too large' };
    }

    // Get user info if available (don't require authentication)
    const auth = await getAuth();
    const userId = auth.user?.id;

    // Create analytics event record
    await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        eventData: data.eventData,
        sessionId: data.sessionId,
        path: data.path,
        userAgent: data.userAgent,
        userId,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    });

    // Update content metrics for specific event types
    await updateContentMetrics(data);

    // Update revenue metrics for purchase events
    if (data.eventType === EVENT_TYPES.PURCHASE) {
      await updateRevenueMetrics(data);
    }

    return { success: true };
  } catch (error) {
    console.error('Track event error:', error);
    return { success: false, error: 'Failed to track event' };
  }
}

export async function trackEvents(events: TrackEventData[]) {
  try {
    // Validate batch size
    if (events.length > ANALYTICS_CONSTANTS.MAX_EVENTS_PER_BATCH) {
      return { success: false, error: 'Too many events in batch' };
    }

    // Get user info if available
    const auth = await getAuth();
    const userId = auth.user?.id;

    // Prepare events for batch insert
    const analyticsEvents = events.map(event => ({
      eventType: event.eventType,
      eventData: event.eventData,
      sessionId: event.sessionId,
      path: event.path,
      userAgent: event.userAgent,
      userId,
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
    }));

    // Batch insert events
    await prisma.analyticsEvent.createMany({
      data: analyticsEvents,
    });

    // Process content and revenue metrics
    for (const event of events) {
      await updateContentMetrics(event);
      if (event.eventType === EVENT_TYPES.PURCHASE) {
        await updateRevenueMetrics(event);
      }
    }

    return { success: true, eventsTracked: events.length };
  } catch (error) {
    console.error('Track events batch error:', error);
    return { success: false, error: 'Failed to track events batch' };
  }
}

async function updateContentMetrics(data: TrackEventData) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (data.eventType) {
      case EVENT_TYPES.ARTICLE_READ:
        if (data.eventData.articleId) {
          await updateMetric('article', data.eventData.articleId, 'view', 1, today);
        }
        break;

      case EVENT_TYPES.VIDEO_PLAY:
        if (data.eventData.videoId) {
          await updateMetric('video', data.eventData.videoId, 'view', 1, today);
        }
        break;

      case EVENT_TYPES.VIDEO_COMPLETE:
        if (data.eventData.videoId) {
          await updateMetric('video', data.eventData.videoId, 'completion', 1, today);
        }
        break;

      case EVENT_TYPES.COURSE_START:
        if (data.eventData.courseId) {
          await updateMetric('course', data.eventData.courseId, 'view', 1, today);
        }
        break;

      case EVENT_TYPES.COURSE_COMPLETE:
        if (data.eventData.courseId) {
          await updateMetric('course', data.eventData.courseId, 'completion', 1, today);
        }
        break;

      case EVENT_TYPES.LESSON_COMPLETE:
        if (data.eventData.courseId) {
          await updateMetric('course', data.eventData.courseId, 'engagement', 1, today);
        }
        break;
    }
  } catch (error) {
    console.error('Update content metrics error:', error);
  }
}

async function updateMetric(
  contentType: string,
  contentId: string,
  metricType: string,
  value: number,
  date: Date
) {
  await prisma.contentMetrics.upsert({
    where: {
      contentType_contentId_metricType_date: {
        contentType,
        contentId,
        metricType,
        date,
      },
    },
    update: {
      value: { increment: value },
    },
    create: {
      contentType,
      contentId,
      metricType,
      value,
      date,
    },
  });
}

async function updateRevenueMetrics(data: TrackEventData) {
  try {
    if (!data.eventData.amount) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const amount = Math.round(data.eventData.amount);
    const isSubscription = data.eventData.productType === 'SUBSCRIPTION';
    const isCourse = data.eventData.productType === 'COURSE';

    await prisma.revenueMetrics.upsert({
      where: { date: today },
      update: {
        revenue: { increment: amount },
        subscriptions: isSubscription ? { increment: 1 } : undefined,
        coursesSold: isCourse ? { increment: 1 } : undefined,
      },
      create: {
        date: today,
        revenue: amount,
        subscriptions: isSubscription ? 1 : 0,
        coursesSold: isCourse ? 1 : 0,
      },
    });
  } catch (error) {
    console.error('Update revenue metrics error:', error);
  }
}