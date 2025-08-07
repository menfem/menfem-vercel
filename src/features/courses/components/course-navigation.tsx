// ABOUTME: Course navigation sidebar showing modules and lessons with progress tracking
// ABOUTME: Provides lesson selection and visual progress indicators

'use client';

import { X, Play, CheckCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { CourseWithRelations } from '../types';
import type { getUserCourseProgress } from '../queries/get-user-course-progress';

interface CourseNavigationProps {
  course: CourseWithRelations;
  userProgress: NonNullable<Awaited<ReturnType<typeof getUserCourseProgress>>>;
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  onClose: () => void;
}

export function CourseNavigation({
  course,
  userProgress,
  currentLessonId,
  onLessonSelect,
  onClose
}: CourseNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(course.modules.map(m => m.id))
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const isLessonCompleted = (lessonId: string) => {
    // Check if lesson has completions
    const lesson = course.modules
      .flatMap(m => m.lessons)
      .find(l => l.id === lessonId);
    return (lesson?.completions?.length ?? 0) > 0;
  };

  const getModuleProgress = (moduleId: string) => {
    const courseModule = course.modules.find(m => m.id === moduleId);
    if (!courseModule) return { completed: 0, total: 0 };
    
    const completed = courseModule.lessons.filter(lesson => 
      isLessonCompleted(lesson.id)
    ).length;
    
    return {
      completed,
      total: courseModule.lessons.length
    };
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">
            {course.product.name}
          </h3>
          <p className="text-sm text-gray-500">
            {Math.round(userProgress.progress.percentage)}% Complete
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Course modules and lessons */}
      <div className="flex-1 overflow-y-auto">
        {course.modules
          .sort((a, b) => a.order - b.order)
          .map((module) => {
            const moduleProgress = getModuleProgress(module.id);
            const isExpanded = expandedModules.has(module.id);

            return (
              <div key={module.id} className="border-b last:border-b-0">
                {/* Module header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {module.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {moduleProgress.completed} of {moduleProgress.total} lessons
                    </p>
                  </div>
                  <div className="flex items-center ml-2">
                    {moduleProgress.completed === moduleProgress.total && moduleProgress.total > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Module lessons */}
                {isExpanded && (
                  <div className="bg-gray-50">
                    {module.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => {
                        const isCompleted = isLessonCompleted(lesson.id);
                        const isCurrent = lesson.id === currentLessonId;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onLessonSelect(lesson.id)}
                            className={`w-full flex items-center p-3 pl-8 text-left hover:bg-gray-100 ${
                              isCurrent ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            ) : isCurrent ? (
                              <Play className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${
                                isCurrent ? 'text-blue-700 font-medium' : 
                                isCompleted ? 'text-gray-700' : 'text-gray-600'
                              }`}>
                                {lesson.title}
                              </p>
                              {lesson.video && (
                                <p className="text-xs text-gray-500">
                                  Video lesson
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}