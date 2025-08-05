// ABOUTME: Individual lesson progress indicator with completion status
// ABOUTME: Shows lesson completion state and provides visual feedback

'use client';

import { CheckCircle, Circle, Play, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LessonProgressIndicatorProps {
  lesson: {
    id: string;
    title: string;
    duration?: number;
    isCompleted: boolean;
    isLocked?: boolean;
    hasVideo?: boolean;
  };
  isActive?: boolean;
  onClick?: () => void;
  showDuration?: boolean;
}

export function LessonProgressIndicator({
  lesson,
  isActive = false,
  onClick,
  showDuration = true
}: LessonProgressIndicatorProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const getIcon = () => {
    if (lesson.isLocked) {
      return <Lock className="h-4 w-4 text-gray-400" />;
    }
    if (lesson.isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (lesson.hasVideo) {
      return <Play className="h-4 w-4 text-blue-500" />;
    }
    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = () => {
    if (lesson.isCompleted) {
      return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Completed</Badge>;
    }
    if (lesson.isLocked) {
      return <Badge variant="secondary" className="text-xs">Locked</Badge>;
    }
    if (isActive) {
      return <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">Current</Badge>;
    }
    return null;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-colors",
        isActive && "bg-blue-50 border-blue-200",
        !isActive && !lesson.isLocked && "hover:bg-gray-50 cursor-pointer",
        lesson.isLocked && "opacity-60 cursor-not-allowed",
        lesson.isCompleted && "bg-green-50 border-green-200"
      )}
      onClick={!lesson.isLocked ? onClick : undefined}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-blue-900" : "text-gray-900",
            lesson.isCompleted && "text-green-900"
          )}>
            {lesson.title}
          </h4>
          
          {showDuration && lesson.duration && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDuration(lesson.duration)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {getStatusBadge()}
      </div>
    </div>
  );
}