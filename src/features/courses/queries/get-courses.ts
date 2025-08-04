// ABOUTME: Query functions for fetching course collections
// ABOUTME: Handles course discovery, enrollment tracking, and filtering

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { CourseWithRelations, CourseFilters } from '../types';

export const getCourses = cache(async (filters: CourseFilters = {}): Promise<CourseWithRelations[]> => {
  const {
    level,
    search,
  } = filters;

  // Build where clause
  const where: any = {
    product: {
      isActive: true,
      type: 'COURSE',
    },
  };

  // Level filter
  if (level) {
    where.level = level;
  }

  // Search filter
  if (search) {
    where.OR = [
      { 
        product: {
          name: { contains: search, mode: 'insensitive' }
        }
      },
      { 
        product: {
          description: { contains: search, mode: 'insensitive' }
        }
      },
      { syllabus: { contains: search, mode: 'insensitive' } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      product: true,
      modules: {
        where: { isPublished: true },
        include: {
          lessons: {
            where: { isPublished: true },
            include: {
              video: true,
              completions: false, // Don't load all completions in list view
              _count: {
                select: {
                  completions: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              lessons: {
                where: { isPublished: true },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      enrollments: {
        select: {
          id: true,
          userId: true,
          progress: true,
          enrolledAt: true,
          completedAt: true,
        },
      },
      _count: {
        select: {
          modules: {
            where: { isPublished: true },
          },
          enrollments: true,
        },
      },
    },
    orderBy: [
      { enrollments: { _count: 'desc' } }, // Most popular first
      { product: { createdAt: 'desc' } },
    ],
  });

  return courses as CourseWithRelations[];
});

export const getPublishedCourses = cache(async (filters: CourseFilters = {}) => {
  return getCourses(filters);
});

export const getCoursesByLevel = cache(async (level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
  return getCourses({ level });
});

export const getFeaturedCourses = cache(async (limit: number = 6): Promise<CourseWithRelations[]> => {
  const courses = await prisma.course.findMany({
    where: {
      product: {
        isActive: true,
        type: 'COURSE',
      },
    },
    include: {
      product: true,
      modules: {
        where: { isPublished: true },
        include: {
          lessons: {
            where: { isPublished: true },
            include: {
              video: true,
              completions: false,
              _count: {
                select: {
                  completions: true,
                },
              },
            },
            orderBy: { order: 'asc' },
            take: 3, // Preview first 3 lessons
          },
          _count: {
            select: {
              lessons: {
                where: { isPublished: true },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
        take: 3, // Preview first 3 modules
      },
      enrollments: false, // Don't load enrollments for featured view
      _count: {
        select: {
          modules: {
            where: { isPublished: true },
          },
          enrollments: true,
        },
      },
    },
    orderBy: [
      { enrollments: { _count: 'desc' } },
      { product: { createdAt: 'desc' } },
    ],
    take: limit,
  });

  return courses as CourseWithRelations[];
});

export const getCoursesForAdmin = cache(async (): Promise<CourseWithRelations[]> => {
  const courses = await prisma.course.findMany({
    include: {
      product: true,
      modules: {
        include: {
          lessons: {
            include: {
              video: true,
              completions: false,
              _count: {
                select: {
                  completions: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      },
      enrollments: {
        select: {
          id: true,
          userId: true,
          progress: true,
          enrolledAt: true,
          completedAt: true,
        },
      },
      _count: {
        select: {
          modules: true,
          enrollments: true,
        },
      },
    },
    orderBy: { product: { createdAt: 'desc' } },
  });

  return courses as CourseWithRelations[];
});