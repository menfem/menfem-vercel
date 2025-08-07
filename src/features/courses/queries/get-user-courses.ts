// ABOUTME: Query function for fetching user's enrolled courses with progress
// ABOUTME: Returns courses with enrollment data and completion statistics

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { calculateCourseProgress } from '../utils/progress-calculator';

export const getUserCourses = cache(async (userId: string) => {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
          modules: {
            include: {
              lessons: {
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

  // Calculate progress for each course
  const coursesWithProgress = enrollments.map(enrollment => {
    const allLessons = enrollment.course.modules.flatMap(m => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter(l => l.completions.length > 0).length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      ...enrollment,
      progress: {
        totalLessons,
        completedLessons,
        percentage,
      },
    };
  });

  return coursesWithProgress;
});