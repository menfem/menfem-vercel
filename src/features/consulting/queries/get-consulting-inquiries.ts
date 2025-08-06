// ABOUTME: Query functions for retrieving consulting inquiries with filtering and pagination
// ABOUTME: Includes statistics and dashboard data for business intelligence

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { 
  ConsultingInquiryWithRelations, 
  ConsultingInquiryFilters,
  ConsultingStats 
} from '../types';
import { InquiryStatus, ProjectStatus } from '@prisma/client';

// Cached function to get consulting inquiries with filters
export const getConsultingInquiries = cache(async (
  filters?: ConsultingInquiryFilters,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const where: Record<string, unknown> = {};

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    if (filters?.priority && filters.priority.length > 0) {
      where.priority = { in: filters.priority };
    }

    if (filters?.companySize && filters.companySize.length > 0) {
      where.companySize = { in: filters.companySize };
    }

    if (filters?.budgetRange && filters.budgetRange.length > 0) {
      where.budgetRange = { in: filters.budgetRange };
    }

    if (filters?.projectType && filters.projectType.length > 0) {
      where.projectType = { hasSome: filters.projectType };
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    if (filters?.dateRange) {
      where.createdAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to
      };
    }

    // Get total count and paginated results
    const [inquiries, totalCount] = await Promise.all([
      prisma.consultingInquiry.findMany({
        where,
        include: {
          assignedConsultant: {
            select: { id: true, email: true, username: true }
          },
          project: {
            select: { id: true, status: true, contractValue: true }
          },
          _count: {
            select: { notes: true, activities: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.consultingInquiry.count({ where })
    ]);

    return {
      inquiries,
      metadata: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasNextPage: totalCount > page * limit,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error fetching consulting inquiries:', error);
    return {
      inquiries: [],
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

// Get single inquiry with all relations
export const getConsultingInquiryById = cache(async (id: string) => {
  try {
    const inquiry = await prisma.consultingInquiry.findUnique({
      where: { id },
      include: {
        assignedConsultant: {
          select: { id: true, email: true, username: true }
        },
        project: {
          include: {
            milestones: {
              orderBy: { dueDate: 'asc' }
            },
            deliverables: {
              orderBy: { createdAt: 'desc' }
            },
            activities: {
              orderBy: { createdAt: 'desc' },
              take: 20
            }
          }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return inquiry as ConsultingInquiryWithRelations | null;
  } catch (error) {
    console.error('Error fetching consulting inquiry:', error);
    return null;
  }
});

// Get dashboard statistics
export const getConsultingStats = cache(async (
  dateRange?: { from: Date; to: Date }
) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const startDate = dateRange?.from || thirtyDaysAgo;
    const endDate = dateRange?.to || new Date();

    // Parallel queries for better performance
    const [
      newInquiries,
      totalInquiries,
      activeProjects,
      inquiriesByStatus,
      projectsByStatus,
      monthlyRevenue,
      conversionData
    ] = await Promise.all([
      // New inquiries in date range
      prisma.consultingInquiry.count({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      }),

      // Total inquiries
      prisma.consultingInquiry.count(),

      // Active projects
      prisma.clientProject.count({
        where: {
          status: { in: ['CONTRACTED', 'IN_PROGRESS'] }
        }
      }),

      // Inquiries by status
      prisma.consultingInquiry.groupBy({
        by: ['status'],
        _count: true
      }),

      // Projects by status
      prisma.clientProject.groupBy({
        by: ['status'],
        _count: true
      }),

      // Monthly revenue (last 12 months)
      prisma.clientProject.groupBy({
        by: ['createdAt'],
        _sum: { contractValue: true },
        where: {
          status: { in: ['COMPLETED', 'IN_PROGRESS'] },
          createdAt: {
            gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Conversion rate calculation
      prisma.consultingInquiry.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          project: {
            select: { status: true, contractValue: true }
          }
        }
      })
    ]);

    // Calculate conversion rate
    const closedWonInquiries = conversionData.filter(
      inquiry => inquiry.project?.status === 'COMPLETED' || inquiry.project?.status === 'IN_PROGRESS'
    ).length;
    const conversionRate = totalInquiries > 0 ? (closedWonInquiries / totalInquiries) * 100 : 0;

    // Calculate average project value
    const completedProjects = await prisma.clientProject.findMany({
      where: { status: { in: ['COMPLETED', 'IN_PROGRESS'] } },
      select: { contractValue: true }
    });
    const avgProjectValue = completedProjects.length > 0 
      ? completedProjects.reduce((sum, p) => sum + p.contractValue, 0) / completedProjects.length 
      : 0;

    // Calculate pipeline value (qualified + proposal sent + negotiating)
    const pipelineInquiries = await prisma.consultingInquiry.findMany({
      where: {
        status: { in: ['QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING'] }
      },
      select: { budgetRange: true }
    });

    // Estimate pipeline value based on budget ranges
    const estimatedPipelineValue = pipelineInquiries.reduce((sum, inquiry) => {
      const midpoints = {
        UNDER_10K: 7500,
        TEN_TO_25K: 17500,
        TWENTY_FIVE_TO_50K: 37500,
        FIFTY_TO_100K: 75000,
        OVER_100K: 125000
      };
      return sum + (midpoints[inquiry.budgetRange] || 0);
    }, 0);

    // Process monthly revenue data
    const revenueByMonth = monthlyRevenue.reduce((acc, item) => {
      const month = item.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      acc[month] = (acc[month] || 0) + (item._sum.contractValue || 0);
      return acc;
    }, {} as Record<string, number>);

    const stats: ConsultingStats = {
      newInquiries,
      activeProjects,
      monthlyRevenue: Object.values(revenueByMonth).reduce((sum, val) => sum + val, 0),
      avgProjectValue: Math.round(avgProjectValue / 100), // Convert from cents to dollars
      conversionRate: Math.round(conversionRate * 100) / 100,
      pipelineValue: Math.round(estimatedPipelineValue / 100), // Convert from cents to dollars
      inquiriesByStatus: inquiriesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<InquiryStatus, number>),
      projectsByStatus: projectsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<ProjectStatus, number>),
      revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue: Math.round(revenue / 100) // Convert from cents to dollars
      }))
    };

    return stats;
  } catch (error) {
    console.error('Error fetching consulting stats:', error);
    return {
      newInquiries: 0,
      activeProjects: 0,
      monthlyRevenue: 0,
      avgProjectValue: 0,
      conversionRate: 0,
      pipelineValue: 0,
      inquiriesByStatus: {} as Record<InquiryStatus, number>,
      projectsByStatus: {} as Record<ProjectStatus, number>,
      revenueByMonth: []
    } as ConsultingStats;
  }
});

// Get recent inquiries for dashboard
export const getRecentInquiries = cache(async (limit: number = 5) => {
  try {
    const inquiries = await prisma.consultingInquiry.findMany({
      include: {
        assignedConsultant: {
          select: { id: true, email: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return inquiries;
  } catch (error) {
    console.error('Error fetching recent inquiries:', error);
    return [];
  }
});

// Get high-priority inquiries
export const getHighPriorityInquiries = cache(async () => {
  try {
    const inquiries = await prisma.consultingInquiry.findMany({
      where: {
        priority: { in: ['HIGH', 'URGENT'] },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      },
      include: {
        assignedConsultant: {
          select: { id: true, email: true, username: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return inquiries;
  } catch (error) {
    console.error('Error fetching high priority inquiries:', error);
    return [];
  }
});