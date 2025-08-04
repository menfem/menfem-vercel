// ABOUTME: Main analytics dashboard component for admin interface
// ABOUTME: Displays key metrics, charts, and performance data

import { getDashboardMetrics } from '../queries/get-dashboard-metrics';
import { MetricCard } from './metric-card';
import { RevenueChart } from './revenue-chart';
import { ContentMetricsTable } from './content-metrics-table';
import { TopPagesTable } from './top-pages-table';

interface AnalyticsDashboardProps {
  timeframe?: string;
}

export async function AnalyticsDashboard({ 
  timeframe = '30d' 
}: AnalyticsDashboardProps) {
  const metrics = await getDashboardMetrics(timeframe);

  return (
    <div className="analytics-dashboard space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${(metrics.totalRevenue / 100).toLocaleString()}`}
          change={metrics.revenueChange}
          trend={metrics.revenueChange >= 0 ? 'up' : 'down'}
          icon="💰"
        />
        <MetricCard
          title="Active Subscribers"
          value={metrics.activeSubscribers.toLocaleString()}
          change={metrics.subscriberChange}
          trend={metrics.subscriberChange >= 0 ? 'up' : 'down'}
          icon="👥"
        />
        <MetricCard
          title="Course Enrollments"
          value={metrics.courseEnrollments.toLocaleString()}
          change={metrics.enrollmentChange}
          trend={metrics.enrollmentChange >= 0 ? 'up' : 'down'}
          icon="🎓"
        />
        <MetricCard
          title="Page Views"
          value={metrics.pageViews.toLocaleString()}
          change={metrics.pageViewChange}
          trend={metrics.pageViewChange >= 0 ? 'up' : 'down'}
          icon="📊"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Over Time
        </h3>
        <RevenueChart data={metrics.revenueData} />
      </div>

      {/* Content Performance and Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Content
          </h3>
          <ContentMetricsTable data={metrics.contentData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Viewed Pages
          </h3>
          <TopPagesTable data={metrics.userMetrics.topPages} />
        </div>
      </div>

      {/* User Metrics Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Engagement Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.userMetrics.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.userMetrics.newUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">New Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.userMetrics.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(metrics.userMetrics.retentionRate)}%
            </div>
            <div className="text-sm text-gray-600">Retention Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}