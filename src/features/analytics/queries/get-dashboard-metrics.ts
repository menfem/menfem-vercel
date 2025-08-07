// ABOUTME: Query functions for analytics dashboard metrics
// ABOUTME: Aggregates data for dashboard display with performance metrics

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { DashboardMetrics, RevenueChartData } from '../types';
import { TIMEFRAMES } from '../constants';

export const getDashboardMetrics = cache(async (
  timeframe: string = TIMEFRAMES.LAST_30_DAYS
): Promise<DashboardMetrics> => {
  const { startDate, endDate } = getTimeframeDates(timeframe);
  const previousPeriod = getPreviousPeriod(startDate, endDate);

  // Execute all queries in parallel for performance
  const [
    revenueData,
    previousRevenueData,
    subscriptionData,
    previousSubscriptionData,
    courseData,
    previousCourseData,
    pageViewData,
    previousPageViewData,
    revenueChartData,
  ] = await Promise.all([
    // Current period revenue
    prisma.revenueMetrics.aggregate({
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { revenue: true },
    }),
    
    // Previous period revenue
    prisma.revenueMetrics.aggregate({
      where: { date: { gte: previousPeriod.start, lte: previousPeriod.end } },
      _sum: { revenue: true },
    }),

    // Current period subscriptions
    prisma.revenueMetrics.aggregate({
      where: { date: { gte: startDate, lte: endDate } },
      _sum: { subscriptions: true },
    }),

    // Previous period subscriptions
    prisma.revenueMetrics.aggregate({
      where: { date: { gte: previousPeriod.start, lte: previousPeriod.end } },
      _sum: { subscriptions: true },
    }),

    // Current period course enrollments
    prisma.courseEnrollment.count({
      where: { enrolledAt: { gte: startDate, lte: endDate } },
    }),

    // Previous period course enrollments
    prisma.courseEnrollment.count({
      where: { 
        enrolledAt: { gte: previousPeriod.start, lte: previousPeriod.end } 
      },
    }),

    // Current period page views
    prisma.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        timestamp: { gte: startDate, lte: endDate },
      },
    }),

    // Previous period page views
    prisma.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        timestamp: { gte: previousPeriod.start, lte: previousPeriod.end },
      },
    }),

    // Revenue chart data
    getRevenueChartData(startDate, endDate),
  ]);

  // Calculate percentage changes
  const totalRevenue = revenueData._sum.revenue || 0;
  const previousRevenue = previousRevenueData._sum.revenue || 0;
  const revenueChange = calculatePercentageChange(totalRevenue, previousRevenue);

  const activeSubscribers = subscriptionData._sum.subscriptions || 0;
  const previousSubscribers = previousSubscriptionData._sum.subscriptions || 0;
  const subscriberChange = calculatePercentageChange(activeSubscribers, previousSubscribers);

  const courseEnrollments = courseData;
  const previousEnrollments = previousCourseData;
  const enrollmentChange = calculatePercentageChange(courseEnrollments, previousEnrollments);

  const pageViews = pageViewData;
  const previousPageViews = previousPageViewData;
  const pageViewChange = calculatePercentageChange(pageViews, previousPageViews);

  return {
    totalRevenue,
    revenueChange,
    activeSubscribers,
    subscriberChange,
    courseEnrollments,
    enrollmentChange,
    pageViews,
    pageViewChange,
    revenueData: revenueChartData,
    contentData: await getContentMetricsData(startDate, endDate),
    userMetrics: await getUserMetricsData(startDate, endDate),
  };
});

async function getRevenueChartData(startDate: Date, endDate: Date): Promise<RevenueChartData[]> {
  const data = await prisma.revenueMetrics.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      revenue: true,
      subscriptions: true,
      coursesSold: true,
    },
  });

  return data.map(item => ({
    date: item.date.toISOString().split('T')[0],
    revenue: item.revenue / 100, // Convert cents to dollars
    subscriptions: item.subscriptions,
    courses: item.coursesSold,
  }));
}

async function getContentMetricsData(startDate: Date, endDate: Date) {
  const metrics = await prisma.contentMetrics.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    select: {
      contentType: true,
      contentId: true,
      metricType: true,
      value: true,
    },
  });

  // Group by content and aggregate metrics
  const contentMap = new Map();
  
  for (const metric of metrics) {
    const key = `${metric.contentType}-${metric.contentId}`;
    if (!contentMap.has(key)) {
      contentMap.set(key, {
        contentType: metric.contentType,
        contentId: metric.contentId,
        views: 0,
        completions: 0,
        engagement: 0,
      });
    }
    
    const content = contentMap.get(key);
    switch (metric.metricType) {
      case 'view':
        content.views += metric.value;
        break;
      case 'completion':
        content.completions += metric.value;
        break;
      case 'engagement':
        content.engagement += metric.value;
        break;
    }
  }

  // Get content titles and return formatted data
  const contentData = Array.from(contentMap.values());
  
  // Fetch titles for each content type
  for (const content of contentData) {
    try {
      let title = 'Unknown';
      
      switch (content.contentType) {
        case 'article':
          const article = await prisma.article.findUnique({
            where: { id: content.contentId },
            select: { title: true },
          });
          title = article?.title || 'Unknown Article';
          break;
          
        case 'video':
          const video = await prisma.video.findUnique({
            where: { id: content.contentId },
            select: { title: true },
          });
          title = video?.title || 'Unknown Video';
          break;
          
        case 'course':
          const course = await prisma.course.findUnique({
            where: { id: content.contentId },
            include: { product: { select: { name: true } } },
          });
          title = course?.product?.name || 'Unknown Course';
          break;
      }
      
      content.contentTitle = title;
    } catch {
      content.contentTitle = 'Unknown Content';
    }
  }

  return contentData.slice(0, 10); // Return top 10 performing content
}

async function getUserMetricsData(startDate: Date, endDate: Date) {
  const [totalUsers, newUsers, sessions, topPages] = await Promise.all([
    // Total registered users
    prisma.user.count(),
    
    // New users in period
    prisma.user.count({
      where: { createdAt: { gte: startDate, lte: endDate } },
    }),
    
    // Active sessions (unique session IDs)
    prisma.analyticsEvent.findMany({
      where: { timestamp: { gte: startDate, lte: endDate } },
      select: { sessionId: true },
      distinct: ['sessionId'],
    }),
    
    // Top pages by views
    prisma.analyticsEvent.groupBy({
      by: ['path'],
      where: {
        eventType: 'page_view',
        timestamp: { gte: startDate, lte: endDate },
      },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
  ]);

  const activeUsers = sessions.length;
  
  return {
    totalUsers,
    newUsers,
    activeUsers,
    retentionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    topPages: topPages
      .filter(page => page.path !== null)
      .map(page => ({
        path: page.path!,
        views: page._count.path,
        uniqueViews: page._count.path, // Simplified - could be more sophisticated
      })),
  };
}

function getTimeframeDates(timeframe: string): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  switch (timeframe) {
    case TIMEFRAMES.LAST_7_DAYS:
      startDate.setDate(startDate.getDate() - 7);
      break;
    case TIMEFRAMES.LAST_30_DAYS:
      startDate.setDate(startDate.getDate() - 30);
      break;
    case TIMEFRAMES.LAST_90_DAYS:
      startDate.setDate(startDate.getDate() - 90);
      break;
    case TIMEFRAMES.LAST_YEAR:
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  return { startDate, endDate };
}

function getPreviousPeriod(startDate: Date, endDate: Date): { start: Date; end: Date } {
  const periodLength = endDate.getTime() - startDate.getTime();
  
  const end = new Date(startDate.getTime() - 1);
  const start = new Date(end.getTime() - periodLength);
  
  return { start, end };
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}