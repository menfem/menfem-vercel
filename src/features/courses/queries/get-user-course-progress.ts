// ABOUTME: Query function for fetching user's progress in a specific course
// ABOUTME: Returns enrollment data with lesson completion status

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getUserCourseProgress = cache(async (userId: string, courseId: string) => {
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
                  video: true,
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

  if (!enrollment) {
    return null;
  }

  // Calculate progress
  const totalLessons = enrollment.course.modules.reduce(
    (count, module) => count + module.lessons.length, 
    0
  );
  
  const completedLessons = enrollment.course.modules.reduce(
    (count, module) => count + module.lessons.filter(lesson => lesson.completions.length > 0).length,
    0
  );

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return {
    ...enrollment,
    progress: {
      totalLessons,
      completedLessons,
      percentage: progressPercentage,
    },
  };
});