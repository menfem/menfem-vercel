// ABOUTME: Query functions for retrieving client projects and related data
// ABOUTME: Includes project details, milestones, deliverables, and activities

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { ClientProjectWithRelations, ClientProjectFilters } from '../types';
import { ProjectStatus } from '@prisma/client';

// Get client project by ID with all relations
export const getClientProject = cache(async (projectId: string) => {
  try {
    const project = await prisma.clientProject.findUnique({
      where: { id: projectId },
      include: {
        inquiry: {
          include: {
            assignedConsultant: {
              select: { id: true, email: true, username: true }
            }
          }
        },
        milestones: {
          orderBy: { dueDate: 'asc' }
        },
        deliverables: {
          orderBy: [
            { status: 'asc' },
            { createdAt: 'desc' }
          ]
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    return project as ClientProjectWithRelations | null;
  } catch (error) {
    console.error('Error fetching client project:', error);
    return null;
  }
});

// Get client project by inquiry ID
export const getClientProjectByInquiry = cache(async (inquiryId: string) => {
  try {
    const project = await prisma.clientProject.findUnique({
      where: { inquiryId },
      include: {
        inquiry: {
          include: {
            assignedConsultant: {
              select: { id: true, email: true, username: true }
            }
          }
        },
        milestones: {
          orderBy: { dueDate: 'asc' }
        },
        deliverables: {
          orderBy: [
            { status: 'asc' },
            { createdAt: 'desc' }
          ]
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    return project as ClientProjectWithRelations | null;
  } catch (error) {
    console.error('Error fetching client project by inquiry:', error);
    return null;
  }
});

// Get all client projects with filtering and pagination
export const getClientProjects = cache(async (
  filters?: ClientProjectFilters,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const where: any = {};

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    if (filters?.projectType && filters.projectType.length > 0) {
      where.projectType = { in: filters.projectType };
    }

    if (filters?.contractValueRange) {
      where.contractValue = {
        gte: filters.contractValueRange.min * 100, // Convert to cents
        lte: filters.contractValueRange.max * 100
      };
    }

    if (filters?.dateRange) {
      where.createdAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to
      };
    }

    // Get total count and paginated results
    const [projects, totalCount] = await Promise.all([
      prisma.clientProject.findMany({
        where,
        include: {
          inquiry: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true
            }
          },
          _count: {
            select: {
              milestones: true,
              deliverables: true,
              activities: true
            }
          }
        },
        orderBy: [
          { status: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.clientProject.count({ where })
    ]);

    return {
      projects,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: totalCount > page * limit,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return {
      projects: [],
      metadata: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
});

// Get active projects (for dashboard)
export const getActiveProjects = cache(async (limit: number = 5) => {
  try {
    const projects = await prisma.clientProject.findMany({
      where: {
        status: { in: [ProjectStatus.CONTRACTED, ProjectStatus.IN_PROGRESS] }
      },
      include: {
        inquiry: {
          select: {
            firstName: true,
            lastName: true,
            company: true
          }
        },
        _count: {
          select: {
            milestones: true,
            deliverables: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });

    return projects;
  } catch (error) {
    console.error('Error fetching active projects:', error);
    return [];
  }
});

// Get project milestones
export const getProjectMilestones = cache(async (projectId: string) => {
  try {
    const milestones = await prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { dueDate: 'asc' }
    });

    return milestones;
  } catch (error) {
    console.error('Error fetching project milestones:', error);
    return [];
  }
});

// Get project deliverables
export const getProjectDeliverables = cache(async (projectId: string) => {
  try {
    const deliverables = await prisma.projectDeliverable.findMany({
      where: { projectId },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return deliverables;
  } catch (error) {
    console.error('Error fetching project deliverables:', error);
    return [];
  }
});

// Get project activities (for timeline)
export const getProjectActivities = cache(async (
  projectId: string, 
  options?: { limit?: number }
) => {
  try {
    const activities = await prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 20
    });

    return activities;
  } catch (error) {
    console.error('Error fetching project activities:', error);
    return [];
  }
});

// Get projects by status for reporting
export const getProjectsByStatus = cache(async () => {
  try {
    const projects = await prisma.clientProject.groupBy({
      by: ['status'],
      _count: true,
      _sum: { contractValue: true }
    });

    return projects.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count,
        totalValue: item._sum.contractValue || 0
      };
      return acc;
    }, {} as Record<ProjectStatus, { count: number; totalValue: number }>);
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    return {} as Record<ProjectStatus, { count: number; totalValue: number }>;
  }
});

// Get overdue milestones across all projects
export const getOverdueMilestones = cache(async () => {
  try {
    const overdueMilestones = await prisma.projectMilestone.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' }
      },
      include: {
        project: {
          include: {
            inquiry: {
              select: {
                firstName: true,
                lastName: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return overdueMilestones;
  } catch (error) {
    console.error('Error fetching overdue milestones:', error);
    return [];
  }
});

// Get revenue metrics for projects
export const getProjectRevenueMetrics = cache(async (
  dateRange?: { from: Date; to: Date }
) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const startDate = dateRange?.from || thirtyDaysAgo;
    const endDate = dateRange?.to || new Date();

    const metrics = await prisma.clientProject.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: [ProjectStatus.COMPLETED, ProjectStatus.IN_PROGRESS] }
      },
      _sum: { contractValue: true },
      _avg: { contractValue: true },
      _count: true
    });

    const monthlyRevenue = await prisma.clientProject.groupBy({
      by: ['createdAt'],
      _sum: { contractValue: true },
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: [ProjectStatus.COMPLETED, ProjectStatus.IN_PROGRESS] }
      }
    });

    return {
      totalRevenue: metrics._sum.contractValue || 0,
      averageProjectValue: metrics._avg.contractValue || 0,
      projectCount: metrics._count,
      monthlyBreakdown: monthlyRevenue.reduce((acc, item) => {
        const month = item.createdAt.toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + (item._sum.contractValue || 0);
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    console.error('Error fetching project revenue metrics:', error);
    return {
      totalRevenue: 0,
      averageProjectValue: 0,
      projectCount: 0,
      monthlyBreakdown: {}
    };
  }
});