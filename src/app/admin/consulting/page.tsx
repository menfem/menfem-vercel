// ABOUTME: Admin consulting dashboard with inquiries and projects overview
// ABOUTME: Displays statistics, recent activity, and management tools for B2B consulting

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getConsultingStats, getRecentInquiries, getHighPriorityInquiries } from '@/features/consulting/queries/get-consulting-inquiries';
import { getActiveProjects, getOverdueMilestones } from '@/features/consulting/queries/get-client-projects';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
  title: 'Consulting Dashboard | Admin',
  description: 'Manage consulting inquiries, projects, and business development activities.'
};

export default async function ConsultingDashboardPage() {
  const [
    stats,
    recentInquiries,
    highPriorityInquiries,
    activeProjects,
    overdueMilestones
  ] = await Promise.all([
    getConsultingStats(),
    getRecentInquiries(5),
    getHighPriorityInquiries(),
    getActiveProjects(5),
    getOverdueMilestones()
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consulting Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your B2B consulting pipeline and client projects
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/admin/consulting/inquiries">
            <Button>View All Inquiries</Button>
          </Link>
          <Link href="/admin/consulting/projects">
            <Button variant="outline">View All Projects</Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">New Inquiries</p>
                <p className="text-3xl font-bold">{stats.newInquiries}</p>
                <p className="text-sm text-green-600 mt-2">This month</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Active Projects</p>
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
                <p className="text-sm text-blue-600 mt-2">In progress</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Monthly Revenue</p>
                <p className="text-3xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-2">+{stats.conversionRate}% conv. rate</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Pipeline Value</p>
                <p className="text-3xl font-bold">${stats.pipelineValue.toLocaleString()}</p>
                <p className="text-sm text-purple-600 mt-2">Estimated</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Priority Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              High Priority Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {highPriorityInquiries.length > 0 ? (
              <div className="space-y-4">
                {highPriorityInquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {inquiry.firstName} {inquiry.lastName}
                        </h4>
                        <Badge variant="destructive" className="text-xs">
                          {inquiry.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{inquiry.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(inquiry.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <Link href={`/admin/consulting/inquiries/${inquiry.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No high priority inquiries at this time.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {project.projectName}
                      </h4>
                      <p className="text-sm text-gray-600">{project.clientCompany}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{project._count.milestones} milestones</span>
                        <span>•</span>
                        <span>{project._count.deliverables} deliverables</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {getStatusLabel(project.status)}
                      </Badge>
                      <Link href={`/admin/consulting/projects/${project.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No active projects at this time.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {inquiry.firstName} {inquiry.lastName}
                      </h4>
                      <Badge variant="outline">
                        {getStatusLabel(inquiry.status)}
                      </Badge>
                      <Badge variant={getPriorityVariant(inquiry.priority)}>
                        {inquiry.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{inquiry.company}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{inquiry.projectType.join(', ')}</span>
                      <span>•</span>
                      <span>{getBudgetLabel(inquiry.budgetRange)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(inquiry.createdAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Link href={`/admin/consulting/inquiries/${inquiry.id}`}>
                    <Button size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No recent inquiries to display.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Overdue Milestones Alert */}
      {overdueMilestones.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Overdue Milestones ({overdueMilestones.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueMilestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-800">
                    {milestone.title} - {milestone.project.inquiry.company}
                  </span>
                  <span className="text-red-600">
                    {formatDistanceToNow(milestone.dueDate, { addSuffix: true })}
                  </span>
                </div>
              ))}
              {overdueMilestones.length > 3 && (
                <p className="text-red-700 text-sm mt-2">
                  And {overdueMilestones.length - 3} more...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getStatusLabel(status: string): string {
  const labels = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUALIFIED: 'Qualified',
    PROPOSAL_SENT: 'Proposal Sent',
    NEGOTIATING: 'Negotiating',
    CLOSED_WON: 'Closed Won',
    CLOSED_LOST: 'Closed Lost',
    PROPOSAL: 'Proposal',
    CONTRACTED: 'Contracted',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'On Hold',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  };
  return labels[status as keyof typeof labels] || status;
}

function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'URGENT': return 'destructive';
    case 'HIGH': return 'default';
    case 'MEDIUM': return 'secondary';
    case 'LOW': return 'outline';
    default: return 'outline';
  }
}

function getBudgetLabel(budgetRange: string): string {
  const labels = {
    UNDER_10K: 'Under $10K',
    TEN_TO_25K: '$10K-$25K',
    TWENTY_FIVE_TO_50K: '$25K-$50K',
    FIFTY_TO_100K: '$50K-$100K',
    OVER_100K: 'Over $100K'
  };
  return labels[budgetRange as keyof typeof labels] || budgetRange;
}