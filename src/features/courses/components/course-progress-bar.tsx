// ABOUTME: Course progress bar component with visual completion tracking
// ABOUTME: Shows overall course progress and lesson completion status

'use client';

import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseProgressBarProps {
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  estimatedTimeRemaining?: string;
  showDetails?: boolean;
}

export function CourseProgressBar({
  courseTitle,
  totalLessons,
  completedLessons,
  progressPercentage,
  estimatedTimeRemaining,
  showDetails = true
}: CourseProgressBarProps) {
  const isCompleted = progressPercentage >= 100;
  const remainingLessons = totalLessons - completedLessons;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{courseTitle}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              {completedLessons} of {totalLessons} lessons
            </div>
            {estimatedTimeRemaining && !isCompleted && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {estimatedTimeRemaining} remaining
              </div>
            )}
          </div>
        </div>
        
        <Badge variant={isCompleted ? "default" : "secondary"}>
          {isCompleted ? "Completed" : `${Math.round(progressPercentage)}%`}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress 
          value={progressPercentage} 
          className="h-3 mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      </div>

      {/* Detailed Stats */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{completedLessons}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Circle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{remainingLessons}</div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="text-xs font-bold text-blue-600">%</div>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-900">{Math.round(progressPercentage)}</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              🎉 Congratulations! You've completed this course!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}