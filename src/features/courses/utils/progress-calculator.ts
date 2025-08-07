// ABOUTME: Utility functions for calculating course and lesson progress
// ABOUTME: Handles progress tracking, completion rates, and learning analytics

import type { 
  CourseProgress, 
  ModuleProgress, 
  LessonWithCompletion,
  CourseEnrollmentWithProgress 
} from '../types';
import type { LessonCompletion } from '@prisma/client';

/**
 * Calculates overall course progress for a user
 */
export function calculateCourseProgress(
  enrollment: CourseEnrollmentWithProgress,
  userCompletions: LessonCompletion[]
): CourseProgress {
  const completionMap = new Map(
    userCompletions.map(c => [c.lessonId, c])
  );

  let totalLessons = 0;
  let completedLessons = 0;
  let nextLesson: LessonWithCompletion | null = null;
  let foundNext = false;

  const modules: ModuleProgress[] = enrollment.course.modules.map(module => {
    const lessonsWithCompletion: LessonWithCompletion[] = module.lessons.map(lesson => {
      const completion = completionMap.get(lesson.id);
      const isCompleted = !!completion;
      
      totalLessons++;
      
      if (isCompleted) {
        completedLessons++;
      }

      const lessonWithCompletion: LessonWithCompletion = {
        ...(lesson as any), // Cast to handle type compatibility 
        isCompleted,
        completedAt: completion?.completedAt,
        completions: completion ? [completion] : [],
      };

      if (!isCompleted && !foundNext && !nextLesson) {
        nextLesson = lessonWithCompletion;
        foundNext = true;
      }

      return lessonWithCompletion;
    });

    const moduleCompletedLessons = lessonsWithCompletion.filter(l => l.isCompleted).length;
    const moduleProgressPercentage = module.lessons.length > 0 
      ? Math.round((moduleCompletedLessons / module.lessons.length) * 100) 
      : 0;

    return {
      moduleId: module.id,
      title: module.title,
      totalLessons: module.lessons.length,
      completedLessons: moduleCompletedLessons,
      progressPercentage: moduleProgressPercentage,
      lessons: lessonsWithCompletion,
    };
  });

  const overallProgress = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  return {
    courseId: enrollment.course.id,
    enrollmentId: enrollment.id,
    totalLessons,
    completedLessons,
    overallProgress,
    modules,
    canContinue: completedLessons < totalLessons,
    nextLesson: nextLesson || undefined,
    lastAccessedAt: enrollment.enrolledAt,
  };
}

/**
 * Calculates module progress percentage
 */
export function calculateModuleProgress(
  moduleId: string,
  totalLessons: number,
  completedLessons: number
): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Determines if a course is completed
 */
export function isCourseCompleted(progress: CourseProgress): boolean {
  return progress.overallProgress >= 100;
}

/**
 * Determines if a module is completed
 */
export function isModuleCompleted(moduleProgress: ModuleProgress): boolean {
  return moduleProgress.progressPercentage >= 100;
}

/**
 * Gets the next lesson in course sequence
 */
export function getNextLesson(progress: CourseProgress): LessonWithCompletion | null {
  for (const courseModule of progress.modules) {
    for (const lesson of courseModule.lessons) {
      if (!lesson.isCompleted) {
        return lesson;
      }
    }
  }
  return null;
}

/**
 * Gets the current module based on progress
 */
export function getCurrentModule(progress: CourseProgress): ModuleProgress | null {
  // Find the first module that's not completed
  for (const courseModule of progress.modules) {
    if (courseModule.progressPercentage < 100) {
      return courseModule;
    }
  }
  
  // If all modules are completed, return the last one
  return progress.modules[progress.modules.length - 1] || null;
}

/**
 * Calculates estimated completion time based on current progress
 */
export function estimateCompletionTime(
  progress: CourseProgress,
  averageLessonMinutes: number = 30
): number {
  const remainingLessons = progress.totalLessons - progress.completedLessons;
  return remainingLessons * averageLessonMinutes;
}

/**
 * Formats completion time to human readable format
 */
export function formatCompletionTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${hours} hours`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0
    ? `${days}d ${remainingHours}h`
    : `${days} days`;
}

/**
 * Gets progress color class based on completion percentage
 */
export function getProgressColorClass(percentage: number): string {
  if (percentage === 0) return 'bg-gray-200';
  if (percentage < 30) return 'bg-red-500';
  if (percentage < 70) return 'bg-yellow-500';
  if (percentage < 100) return 'bg-blue-500';
  return 'bg-green-500';
}

/**
 * Calculates learning streak (consecutive days with lesson completions)
 */
export function calculateLearningStreak(completions: LessonCompletion[]): number {
  if (completions.length === 0) return 0;

  // Sort completions by date (newest first)
  const sortedCompletions = completions
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Group completions by date
  const completionsByDate = new Map<string, LessonCompletion[]>();
  
  for (const completion of sortedCompletions) {
    const dateKey = completion.completedAt.toISOString().split('T')[0];
    if (!completionsByDate.has(dateKey)) {
      completionsByDate.set(dateKey, []);
    }
    completionsByDate.get(dateKey)!.push(completion);
  }

  // Calculate streak
  while (true) {
    const dateKey = currentDate.toISOString().split('T')[0];
    
    if (completionsByDate.has(dateKey)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Gets progress status text
 */
export function getProgressStatusText(percentage: number): string {
  if (percentage === 0) return 'Not Started';
  if (percentage < 100) return 'In Progress';
  return 'Completed';
}