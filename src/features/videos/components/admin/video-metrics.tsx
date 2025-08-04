// ABOUTME: Video analytics metrics component for admin dashboard
// ABOUTME: Shows video performance data and engagement statistics

import { prisma } from '@/lib/prisma';

interface VideoMetricsProps {
  videoId: string;
}

export async function VideoMetrics({ videoId }: VideoMetricsProps) {
  // Get video analytics data
  const [viewEvents, engagementData, recentViews] = await Promise.all([
    // Total video views from analytics
    prisma.analyticsEvent.count({
      where: {
        eventType: 'video_play',
        eventData: {
          path: ['videoId'],
          equals: videoId,
        },
      },
    }),

    // Engagement metrics
    prisma.analyticsEvent.findMany({
      where: {
        eventType: {
          in: ['video_play', 'video_complete'],
        },
        eventData: {
          path: ['videoId'],
          equals: videoId,
        },
      },
      select: {
        eventType: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    }),

    // Recent views (last 30 days)
    prisma.analyticsEvent.count({
      where: {
        eventType: 'video_play',
        eventData: {
          path: ['videoId'],
          equals: videoId,
        },
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  // Calculate completion rate
  const playEvents = engagementData.filter(e => e.eventType === 'video_play').length;
  const completeEvents = engagementData.filter(e => e.eventType === 'video_complete').length;
  const completionRate = playEvents > 0 ? Math.round((completeEvents / playEvents) * 100) : 0;

  // Calculate trend (simplified)
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentEvents = engagementData.filter(e => e.timestamp >= last7Days);
  const trend = recentEvents.length > 0 ? '+' : '';

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Analytics</h2>
      
      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{viewEvents}</div>
            <div className="text-sm text-blue-600">Total Views</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <div className="text-sm text-green-600">Completion Rate</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Views (30 days)</span>
            <span className="font-medium">{recentViews}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completions</span>
            <span className="font-medium">{completeEvents}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Engagement Score</span>
            <span className="font-medium">
              {completionRate >= 70 ? 'High' : completionRate >= 40 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="pt-3 border-t">
          <div className="text-xs text-gray-500 mb-2">Performance</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                completionRate >= 70 ? 'bg-green-500' :
                completionRate >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {completionRate >= 70 ? 'Excellent engagement' :
             completionRate >= 40 ? 'Good engagement' :
             'Needs improvement'}
          </div>
        </div>
      </div>
    </div>
  );
}