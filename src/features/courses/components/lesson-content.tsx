// ABOUTME: Lesson content display component with video player and text content
// ABOUTME: Handles rendering of lesson materials including videos and formatted text

'use client';

import { Play, FileText } from 'lucide-react';
import type { CourseLessonWithVideo } from '../types';

interface LessonContentProps {
  lesson: CourseLessonWithVideo;
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Lesson header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {lesson.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Module: {lesson.module?.title}</span>
        </div>
      </div>

      {/* Video content */}
      {lesson.video && (
        <div className="mb-8">
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            {lesson.video.url ? (
              <video
                controls
                className="w-full h-full"
                poster={lesson.video.thumbnailUrl || undefined}
              >
                <source src={lesson.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Video not available</p>
                </div>
              </div>
            )}
          </div>
          
          {lesson.video.title && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900">
                {lesson.video.title}
              </h3>
              {lesson.video.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {lesson.video.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Text content */}
      {lesson.content && (
        <div className="prose prose-lg max-w-none">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Lesson Notes</h3>
          </div>
          
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>
      )}

      {/* Empty state */}
      {!lesson.video && !lesson.content && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No content available
          </h3>
          <p className="text-gray-500">
            This lesson doesn&apos;t have any content yet.
          </p>
        </div>
      )}
    </div>
  );
}