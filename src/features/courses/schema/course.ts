// ABOUTME: Zod validation schemas for course data
// ABOUTME: Handles form validation and data sanitization for course operations

import { z } from 'zod';
import { COURSE_CONSTANTS } from '../constants';

// Course creation schema
export const createCourseSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  syllabus: z
    .string()
    .min(50, 'Syllabus must be at least 50 characters long')
    .max(COURSE_CONSTANTS.MAX_SYLLABUS_LENGTH, 'Syllabus is too long'),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must be less than 50 characters'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});

// Course update schema
export const updateCourseSchema = createCourseSchema.partial().extend({
  id: z.string().cuid(),
});

// Course module creation schema
export const createCourseModuleSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
  title: z
    .string()
    .min(3, 'Module title must be at least 3 characters long')
    .max(255, 'Module title must be less than 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(2000, 'Description must be less than 2000 characters'),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order cannot be negative'),
  isPublished: z.boolean().default(false),
});

// Course module update schema
export const updateCourseModuleSchema = createCourseModuleSchema.partial().extend({
  id: z.string().cuid(),
});

// Course lesson creation schema
export const createCourseLessonSchema = z.object({
  moduleId: z.string().cuid('Invalid module ID'),
  title: z
    .string()
    .min(3, 'Lesson title must be at least 3 characters long')
    .max(255, 'Lesson title must be less than 255 characters'),
  content: z
    .string()
    .min(50, 'Lesson content must be at least 50 characters long')
    .max(COURSE_CONSTANTS.MAX_LESSON_CONTENT_LENGTH, 'Lesson content is too long'),
  videoId: z.string().cuid().optional(),
  order: z
    .number()
    .int('Order must be a whole number')
    .min(0, 'Order cannot be negative'),
  isPublished: z.boolean().default(false),
});

// Course lesson update schema
export const updateCourseLessonSchema = createCourseLessonSchema.partial().extend({
  id: z.string().cuid(),
});

// Lesson completion schema
export const completeLessonSchema = z.object({
  lessonId: z.string().cuid('Invalid lesson ID'),
  userId: z.string().cuid('Invalid user ID'),
});

// Course enrollment schema
export const enrollInCourseSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
  userId: z.string().cuid('Invalid user ID'),
});

// Progress update schema
export const updateProgressSchema = z.object({
  enrollmentId: z.string().cuid('Invalid enrollment ID'),
  progress: z
    .number()
    .min(COURSE_CONSTANTS.MIN_PROGRESS_PERCENTAGE, 'Progress cannot be negative')
    .max(COURSE_CONSTANTS.MAX_PROGRESS_PERCENTAGE, 'Progress cannot exceed 100%'),
});

// Course search and filter schema
export const courseFiltersSchema = z.object({
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  enrolledOnly: z.boolean().optional(),
  completedOnly: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(COURSE_CONSTANTS.MAX_PAGE_SIZE).default(COURSE_CONSTANTS.DEFAULT_PAGE_SIZE),
});

// Bulk lesson completion schema (for admin)
export const bulkCompleteLessonsSchema = z.object({
  lessonIds: z.array(z.string().cuid()).min(1, 'At least one lesson ID required'),
  userId: z.string().cuid('Invalid user ID'),
});

// Course reorder schema
export const reorderModulesSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
  moduleOrder: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })).min(1, 'At least one module required'),
});

export const reorderLessonsSchema = z.object({
  moduleId: z.string().cuid('Invalid module ID'),
  lessonOrder: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })).min(1, 'At least one lesson required'),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateCourseModuleInput = z.infer<typeof createCourseModuleSchema>;
export type UpdateCourseModuleInput = z.infer<typeof updateCourseModuleSchema>;
export type CreateCourseLessonInput = z.infer<typeof createCourseLessonSchema>;
export type UpdateCourseLessonInput = z.infer<typeof updateCourseLessonSchema>;
export type CompleteLessonInput = z.infer<typeof completeLessonSchema>;
export type EnrollInCourseInput = z.infer<typeof enrollInCourseSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type CourseFiltersInput = z.infer<typeof courseFiltersSchema>;