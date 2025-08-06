// ABOUTME: Button component for marking lessons as complete
// ABOUTME: Handles lesson completion with loading states and feedback

'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { completeLesson } from '../actions/complete-lesson';
import { toast } from 'sonner';

interface LessonCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
  onComplete?: () => void;
}

export function LessonCompleteButton({
  lessonId,
  isCompleted,
  onComplete
}: LessonCompleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);

  const handleComplete = async () => {
    if (optimisticCompleted || isPending) return;

    // Optimistic update
    setOptimisticCompleted(true);

    startTransition(async () => {
      try {
        const result = await completeLesson(lessonId);

        if (result.status === 'SUCCESS') {
          toast.success(result.message || 'Lesson completed!');
          onComplete?.();
        } else {
          // Revert optimistic update on error
          setOptimisticCompleted(false);
          toast.error(result.message || 'Failed to complete lesson');
        }
      } catch {
        // Revert optimistic update on error
        setOptimisticCompleted(false);
        toast.error('Failed to complete lesson');
      }
    });
  };

  if (optimisticCompleted) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Completed</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">
        {isPending ? 'Completing...' : 'Mark Complete'}
      </span>
    </button>
  );
}