// ABOUTME: Main course player component with lesson navigation and content display
// ABOUTME: Handles lesson selection, progress tracking, and course completion

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CourseNavigation } from './course-navigation';
import { LessonContent } from './lesson-content';
import { CourseHeader } from './course-header';
import { LessonCompleteButton } from './lesson-complete-button';
import type { CourseWithRelations } from '../types';
import type { getUserCourseProgress } from '../queries/get-user-course-progress';

interface CoursePlayerProps {
  course: CourseWithRelations;
  userProgress: NonNullable<Awaited<ReturnType<typeof getUserCourseProgress>>>;
  selectedLessonId?: string;
}

export function CoursePlayer({
  course,
  userProgress,
  selectedLessonId
}: CoursePlayerProps) {
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState<(typeof allLessons)[0] | null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);

  // Find all lessons across modules
  const allLessons = course.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title,
      moduleOrder: module.order,
    }))
  );

  // Set initial lesson
  useEffect(() => {
    let lessonToSelect = null;

    if (selectedLessonId) {
      lessonToSelect = allLessons.find(lesson => lesson.id === selectedLessonId);
    }
    
    if (!lessonToSelect) {
      // Find first incomplete lesson or first lesson
      lessonToSelect = allLessons.find(lesson => lesson.completions.length === 0) || allLessons[0];
    }

    if (lessonToSelect && lessonToSelect.id !== currentLesson?.id) {
      setCurrentLesson(lessonToSelect);
    }
  }, [selectedLessonId, allLessons, currentLesson?.id]);

  const handleLessonSelect = (lessonId: string) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      router.push(`/courses/${course.id}?lessonId=${lessonId}`, { scroll: false });
    }
  };

  const handleNextLesson = () => {
    if (!currentLesson) return;
    
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = allLessons[currentIndex + 1];
    
    if (nextLesson) {
      handleLessonSelect(nextLesson.id);
    }
  };

  const handlePreviousLesson = () => {
    if (!currentLesson) return;
    
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    const previousLesson = allLessons[currentIndex - 1];
    
    if (previousLesson) {
      handleLessonSelect(previousLesson.id);
    }
  };

  if (!currentLesson) {
    return <div>Loading...</div>;
  }

  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const hasNextLesson = currentIndex < allLessons.length - 1;
  const hasPreviousLesson = currentIndex > 0;
  const isCompleted = currentLesson.completions.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Course Navigation Sidebar */}
      <div className={`${
        isNavigationOpen ? 'w-80' : 'w-0'
      } transition-all duration-300 overflow-hidden border-r bg-white`}>
        <CourseNavigation
          course={course}
          userProgress={userProgress}
          currentLessonId={currentLesson.id}
          onLessonSelect={handleLessonSelect}
          onClose={() => setIsNavigationOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Course Header */}
        <CourseHeader
          course={course}
          currentLesson={currentLesson}
          progress={userProgress.progress}
          isNavigationOpen={isNavigationOpen}
          onToggleNavigation={() => setIsNavigationOpen(!isNavigationOpen)}
        />

        {/* Lesson Content */}
        <div className="flex-1 overflow-auto">
          <LessonContent lesson={currentLesson} />
        </div>

        {/* Lesson Controls */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousLesson}
              disabled={!hasPreviousLesson}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Lesson
            </button>

            <div className="flex items-center gap-4">
              <LessonCompleteButton
                lessonId={currentLesson.id}
                isCompleted={isCompleted}
                onComplete={() => {
                  // Refresh the page to update completion status
                  window.location.reload();
                }}
              />
              
              <button
                onClick={handleNextLesson}
                disabled={!hasNextLesson}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Lesson →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}