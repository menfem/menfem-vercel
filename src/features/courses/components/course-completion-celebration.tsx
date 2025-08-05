// ABOUTME: Course completion celebration modal with certificate and next steps
// ABOUTME: Displays congratulations message and provides course completion rewards

'use client';

import { useState } from 'react';
import { Trophy, Download, Share2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

interface CourseCompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    completedAt: Date;
    certificateUrl?: string;
  };
  nextSteps?: {
    suggestedCourses?: Array<{
      id: string;
      title: string;
      slug: string;
    }>;
    bonusContent?: string;
  };
}

export function CourseCompletionCelebration({
  isOpen,
  onClose,
  course,
  nextSteps
}: CourseCompletionCelebrationProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: `I just completed ${course.title}!`,
          text: `Just finished the ${course.title} course. Great insights on personal development and relationships!`,
          url: window.location.origin + `/courses/${course.id}`
        });
      } catch (error) {
        // User cancelled or error occurred
      }
      setIsSharing(false);
    } else {
      // Fallback to clipboard
      const text = `I just completed ${course.title}! Check it out: ${window.location.origin}/courses/${course.id}`;
      navigator.clipboard.writeText(text);
    }
  };

  const formatCompletionDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            🎉 Congratulations!
          </DialogTitle>
          <DialogDescription className="text-lg mt-2">
            You've successfully completed <strong>{course.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Badge */}
          <div className="text-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-sm">
              Course Completed on {formatCompletionDate(course.completedAt)}
            </Badge>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {course.certificateUrl && (
              <a href={course.certificateUrl} download>
                <Button variant="outline" className="flex items-center gap-2 w-full">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              </a>
            )}
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4" />
              Share Achievement
            </Button>
          </div>

          {/* Next Steps */}
          {nextSteps && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-blue-600" />
                What's Next?
              </h3>
              
              {nextSteps.suggestedCourses && nextSteps.suggestedCourses.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Recommended Courses</h4>
                  <div className="space-y-2">
                    {nextSteps.suggestedCourses.map((suggestedCourse) => (
                      <Link
                        key={suggestedCourse.id}
                        href={`/products/${suggestedCourse.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{suggestedCourse.title}</span>
                        <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {nextSteps.bonusContent && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Bonus Content Unlocked!</h4>
                  <p className="text-blue-800 text-sm">{nextSteps.bonusContent}</p>
                </div>
              )}
            </div>
          )}

          {/* Continue Learning */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={onClose} className="flex-1">
              Continue Learning
            </Button>
            <Link href="/courses" className="flex-1">
              <Button variant="outline" className="w-full">Browse More Courses</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}