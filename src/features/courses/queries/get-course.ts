// ABOUTME: Query functions for fetching individual courses
// ABOUTME: Retrieves single course with complete structure and user progress

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { CourseWithRelations, CourseProgress } from '../types';
import { calculateCourseProgress } from '../utils/progress-calculator';

export const getCourse = cache(async (id: string): Promise<CourseWithRelations | null> => {
  const course = await prisma.course.findUnique({
    where: { id },
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
  });

  return course as CourseWithRelations | null;
});

export const getCourseForAdmin = cache(async (id: string): Promise<CourseWithRelations | null> => {
  const course = await prisma.course.findUnique({
    where: { id },
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
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      },
      _count: {
        select: {
          modules: true,
          enrollments: true,
        },
      },
    },
  });

  return course as CourseWithRelations | null;
});

export const getCourseByProductId = cache(async (productId: string): Promise<CourseWithRelations | null> => {
  const course = await prisma.course.findUnique({
    where: { productId },
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
      enrollments: false,
      _count: {
        select: {
          modules: {
            where: { isPublished: true },
          },
          enrollments: true,
        },
      },
    },
  });

  return course as CourseWithRelations | null;
});

export const getUserCourseProgress = cache(async (
  courseId: string, 
  userId: string
): Promise<CourseProgress | null> => {
  // Get user's enrollment
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      course: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: true,
            },
          },
          modules: {
            where: { isPublished: true },
            include: {
              lessons: {
                where: { isPublished: true },
                include: {
                  completions: {
                    where: { userId },
                  },
                },
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!enrollment) return null;

  // Get all user's lesson completions for this course
  const userCompletions = await prisma.lessonCompletion.findMany({
    where: {
      userId,
      lesson: {
        module: {
          courseId,
        },
      },
    },
  });

  return calculateCourseProgress(enrollment as any, userCompletions);
});

export const isUserEnrolled = cache(async (courseId: string, userId: string): Promise<boolean> => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  return !!enrollment;
});

export const getUserEnrolledCourses = cache(async (userId: string): Promise<CourseProgress[]> => {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: true,
            },
          },
          modules: {
            where: { isPublished: true },
            include: {
              lessons: {
                where: { isPublished: true },
                include: {
                  completions: {
                    where: { userId },
                  },
                },
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  // Get all user's lesson completions
  const userCompletions = await prisma.lessonCompletion.findMany({
    where: { userId },
  });

  return enrollments.map(enrollment => 
    calculateCourseProgress(enrollment as any, userCompletions)
  );
});

export const getCompletedCourses = cache(async (userId: string): Promise<CourseProgress[]> => {
  const allProgress = await getUserEnrolledCourses(userId);
  return allProgress.filter(progress => progress.overallProgress >= 100);
});