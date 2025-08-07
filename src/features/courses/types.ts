// ABOUTME: TypeScript type definitions for the courses feature
// ABOUTME: Defines interfaces and types used across the course learning management system

import type { 
  Course, 
  CourseModule, 
  CourseLesson, 
  CourseEnrollment, 
  LessonCompletion,
  Product,
  Video,
  User 
} from '@prisma/client';
import type { ProductWithRelations } from '@/features/products/types';

export type CourseWithRelations = Course & {
  product: ProductWithRelations;
  modules: CourseModuleWithLessons[];
  enrollments: CourseEnrollmentWithUser[];
  _count: {
    modules: number;
    enrollments: number;
  };
};

export type CourseModuleWithLessons = CourseModule & {
  course: Course;
  lessons: CourseLessonWithVideo[];
  _count: {
    lessons: number;
  };
};

export type CourseLessonWithVideo = CourseLesson & {
  module: CourseModule;
  video?: Video | null;
  completions: LessonCompletion[];
  _count: {
    completions: number;
  };
};

export type CourseEnrollmentWithUser = CourseEnrollment & {
  user: Pick<User, 'id' | 'email' | 'username'>;
  course: CourseWithRelations;
};

export type CourseEnrollmentWithProgress = CourseEnrollment & {
  course: {
    id: string;
    product: {
      name: string;
      slug: string;
      images: string[];
    };
    modules: Array<{
      id: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        completions: LessonCompletion[];
      }>;
    }>;
  };
};

export type LessonWithCompletion = CourseLessonWithVideo & {
  isCompleted: boolean;
  completedAt?: Date;
};

export type ModuleProgress = {
  moduleId: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessons: LessonWithCompletion[];
};

export type CourseProgress = {
  courseId: string;
  enrollmentId: string;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  modules: ModuleProgress[];
  canContinue: boolean;
  nextLesson?: CourseLessonWithVideo;
  lastAccessedAt?: Date;
};

export type UserCourseProgress = CourseEnrollment & {
  course: {
    product: {
      category: {
        name: string;
        id: string;
        slug: string;
        description: string | null;
      };
    } & {
      id: string;
      name: string;
      slug: string;
      description: string;
      shortDesc: string | null;
      images: string[];
      price: number;
      comparePrice: number | null;
      isActive: boolean;
      isDigital: boolean;
      stock: number | null;
      type: string;
      categoryId: string;
      courseId: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    modules: ({
      lessons: ({
        completions: {
          id: string;
          userId: string;
          lessonId: string;
          completedAt: Date;
        }[];
        video: {
          id: string;
          title: string;
          description: string;
          youtubeId: string | null;
          embedUrl: string | null;
          thumbnailUrl: string | null;
          duration: number | null;
          isPublished: boolean;
          isPremium: boolean;
          viewCount: number;
          createdAt: Date;
          updatedAt: Date;
          seriesId: string | null;
        } | null;
      } & {
        id: string;
        moduleId: string;
        title: string;
        content: string;
        videoId: string | null;
        order: number;
        isPublished: boolean;
      })[];
    } & {
      id: string;
      courseId: string;
      title: string;
      description: string;
      order: number;
      isPublished: boolean;
    })[];
  } & {
    id: string;
    productId: string;
    syllabus: string;
    duration: string;
    level: string;
  };
  progress: {
    totalLessons: number;
    completedLessons: number;
    percentage: number;
  };
};

export type CourseFormData = {
  productId: string;
  syllabus: string;
  duration: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};

export type CourseModuleFormData = {
  courseId: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
};

export type CourseLessonFormData = {
  moduleId: string;
  title: string;
  content: string;
  videoId?: string;
  order: number;
  isPublished: boolean;
};

export type CourseFilters = {
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  enrolledOnly?: boolean;
  completedOnly?: boolean;
  search?: string;
  isPublished?: boolean;
  limit?: number;
};