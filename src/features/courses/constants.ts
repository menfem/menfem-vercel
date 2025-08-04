// ABOUTME: Constants and configuration for the courses feature
// ABOUTME: Centralized constants for course management and learning platform

export const COURSE_CONSTANTS = {
  // Progress tracking
  MIN_PROGRESS_PERCENTAGE: 0,
  MAX_PROGRESS_PERCENTAGE: 100,
  COMPLETION_THRESHOLD: 100,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  
  // Content limits
  MAX_MODULES_PER_COURSE: 20,
  MAX_LESSONS_PER_MODULE: 50,
  MAX_SYLLABUS_LENGTH: 10000,
  MAX_LESSON_CONTENT_LENGTH: 50000,
  
  // Duration formats
  DURATION_PATTERNS: [
    /^(\d+)\s*weeks?$/i,
    /^(\d+)\s*months?$/i,
    /^self-paced$/i,
    /^(\d+)-(\d+)\s*weeks?$/i,
  ],
} as const;

export const COURSE_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', description: 'No prior experience required' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some background knowledge helpful' },
  { value: 'ADVANCED', label: 'Advanced', description: 'Significant experience recommended' },
] as const;

export const COURSE_DURATIONS = [
  { value: '4 weeks', label: '4 Weeks' },
  { value: '6 weeks', label: '6 Weeks' },
  { value: '8 weeks', label: '8 Weeks' },
  { value: '12 weeks', label: '12 Weeks' },
  { value: '6 months', label: '6 Months' },
  { value: 'Self-paced', label: 'Self-Paced' },
] as const;

export const COURSE_SORT_OPTIONS = [
  { value: 'enrolledAt_desc', label: 'Recently Enrolled' },
  { value: 'progress_desc', label: 'Most Progress' },
  { value: 'progress_asc', label: 'Least Progress' },
  { value: 'name_asc', label: 'Course Name A-Z' },
  { value: 'name_desc', label: 'Course Name Z-A' },
] as const;

export const LESSON_TYPES = [
  { value: 'video', label: 'Video Lesson', icon: '🎥' },
  { value: 'text', label: 'Text Content', icon: '📖' },
  { value: 'mixed', label: 'Video + Text', icon: '🎬' },
] as const;

export const PROGRESS_COLORS = {
  NOT_STARTED: 'bg-gray-200',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  OVERDUE: 'bg-red-500',
} as const;

export const ACHIEVEMENT_TYPES = {
  FIRST_LESSON: 'first_lesson_completed',
  FIRST_MODULE: 'first_module_completed',
  COURSE_COMPLETED: 'course_completed',
  STREAK_7_DAYS: 'seven_day_streak',
  STREAK_30_DAYS: 'thirty_day_streak',
} as const;

export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  EXPIRED: 'expired',
} as const;