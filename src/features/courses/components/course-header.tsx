// ABOUTME: Course player header with navigation toggle and progress display
// ABOUTME: Shows current lesson info, course progress, and sidebar toggle button

'use client';

import { Menu, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CourseWithRelations, CourseLessonWithVideo } from '../types';

interface CourseHeaderProps {
  course: CourseWithRelations;
  currentLesson: CourseLessonWithVideo;
  progress: number;
  isNavigationOpen: boolean;
  onToggleNavigation: () => void;
}

export function CourseHeader({
  course,
  currentLesson,
  progress,
  isNavigationOpen,
  onToggleNavigation
}: CourseHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Navigation toggle */}
          <button
            onClick={onToggleNavigation}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label={isNavigationOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isNavigationOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Back to course link */}
          <Link
            href={`/products/${course.product.slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </div>

        {/* Center section - Current lesson info */}
        <div className="flex-1 min-w-0 px-4">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {currentLesson.title}
            </h1>
            <p className="text-sm text-gray-500 truncate">
              {course.product.name}
            </p>
          </div>
        </div>

        {/* Right section - Progress */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {progress}% Complete
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}