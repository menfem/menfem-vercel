// ABOUTME: Client dashboard component for B2B project management portal
// ABOUTME: Displays project overview, timeline, milestones, and activities for clients

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate, formatDistanceToNow } from 'date-fns';
import type { ClientProjectWithRelations } from '../../types';
import { ProjectStatus, MilestoneStatus, DeliverableStatus } from '@prisma/client';

interface ClientDashboardProps {
  project: ClientProjectWithRelations;
}

export async function ClientDashboard({ project }: ClientDashboardProps) {
  const progress = calculateProjectProgress(project.milestones);
  const nextMilestone = getNextMilestone(project.milestones);
  const recentActivities = project.activities.slice(0, 10);
  const upcomingDeliverables = project.deliverables.filter(
    d => d.status === DeliverableStatus.PENDING || d.status === DeliverableStatus.IN_PROGRESS
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.projectName}</h1>
            <p className="text-lg text-gray-600 mb-4">{project.clientCompany}</p>
            <div className="flex items-center gap-4">
              <Badge variant={getStatusVariant(project.status)} className="text-sm">
                {getStatusLabel(project.status)}
              </Badge>
              <span className="text-sm text-gray-500">
                Project Type: {getProjectTypeLabel(project.projectType)}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Contract Value</div>
            <div className="text-2xl font-bold text-gray-900">
              ${(project.contractValue / 100).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Progress</p>
                <p className="text-2xl font-bold">{progress}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={progress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Days Active</p>
                <p className="text-2xl font-bold">
                  {project.startDate ? 
                    Math.floor((Date.now() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 
                    0
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Hours Worked</p>
                <p className="text-2xl font-bold">{project.actualHours}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Deliverables</p>
                <p className="text-2xl font-bold">{project.deliverables.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MilestonesTimeline milestones={project.milestones} />
          </CardContent>
        </Card>

        {/* Upcoming Deliverables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upcoming Deliverables
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeliverables.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{deliverable.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {getDeliverableStatusLabel(deliverable.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No upcoming deliverables at this time.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed activities={recentActivities} />
        </CardContent>
      </Card>

      {/* Next Steps */}
      {nextMilestone && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="h-5 w-5" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">{nextMilestone.title}</h3>
                <p className="text-blue-800 mb-4">{nextMilestone.description}</p>
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <span>Due: {formatDate(nextMilestone.dueDate, 'MMM dd, yyyy')}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(nextMilestone.dueDate, { addSuffix: true })}</span>
                </div>
              </div>
              <Badge variant={getMilestoneStatusVariant(nextMilestone.status)}>
                {getMilestoneStatusLabel(nextMilestone.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper Components
function MilestonesTimeline({ milestones }: { milestones: Array<{
  id: string;
  title: string;
  status: MilestoneStatus;
  targetDate: Date;
  completedDate?: Date;
}> }) {
  const sortedMilestones = milestones.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMilestones.map((milestone, index) => (
        <div key={milestone.id} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
              milestone.status === MilestoneStatus.COMPLETED 
                ? 'bg-green-500' 
                : milestone.status === MilestoneStatus.IN_PROGRESS
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}></div>
            {index < sortedMilestones.length - 1 && (
              <div className="w-px h-12 bg-gray-200 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Due: {formatDate(milestone.dueDate, 'MMM dd, yyyy')}
                </p>
              </div>
              <Badge variant={getMilestoneStatusVariant(milestone.status)} className="ml-4">
                {getMilestoneStatusLabel(milestone.status)}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityFeed({ activities }: { activities: Array<{
  id: string;
  type: string;
  description: string;
  createdAt: Date;
}> }) {
  if (activities.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No recent activity to display.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
          <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper Functions
function calculateProjectProgress(milestones: Array<{ status: MilestoneStatus }>): number {
  if (milestones.length === 0) return 0;
  
  const completedMilestones = milestones.filter(
    m => m.status === MilestoneStatus.COMPLETED
  ).length;
  
  return Math.round((completedMilestones / milestones.length) * 100);
}

function getNextMilestone(milestones: Array<{
  status: MilestoneStatus;
  targetDate: Date;
  title: string;
}>) {
  return milestones
    .filter(m => m.status !== MilestoneStatus.COMPLETED)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
}

function getStatusVariant(status: ProjectStatus) {
  switch (status) {
    case ProjectStatus.COMPLETED: return 'default';
    case ProjectStatus.IN_PROGRESS: return 'secondary';
    case ProjectStatus.ON_HOLD: return 'outline';
    case ProjectStatus.CANCELLED: return 'destructive';
    default: return 'outline';
  }
}

function getStatusLabel(status: ProjectStatus): string {
  const labels = {
    PROPOSAL: 'Proposal',
    CONTRACTED: 'Contracted',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'On Hold',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  };
  return labels[status] || status;
}

function getProjectTypeLabel(type: string): string {
  const labels = {
    BRAND_STRATEGY: 'Brand Strategy',
    CONTENT_STRATEGY: 'Content Strategy',
    COMMUNITY_BUILDING: 'Community Building',
    AI_INTEGRATION: 'AI Integration',
    MARKET_RESEARCH: 'Market Research',
    SPEAKING_ENGAGEMENT: 'Speaking Engagement',
    ADVISORY_RETAINER: 'Advisory Retainer'
  };
  return labels[type as keyof typeof labels] || type;
}

function getMilestoneStatusVariant(status: MilestoneStatus) {
  switch (status) {
    case MilestoneStatus.COMPLETED: return 'default';
    case MilestoneStatus.IN_PROGRESS: return 'secondary';
    case MilestoneStatus.OVERDUE: return 'destructive';
    default: return 'outline';
  }
}

function getMilestoneStatusLabel(status: MilestoneStatus): string {
  const labels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    OVERDUE: 'Overdue'
  };
  return labels[status] || status;
}

function getDeliverableStatusLabel(status: DeliverableStatus): string {
  const labels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    DELIVERED: 'Delivered',
    APPROVED: 'Approved'
  };
  return labels[status] || status;
}