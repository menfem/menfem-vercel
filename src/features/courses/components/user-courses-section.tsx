// ABOUTME: User courses section displaying enrolled courses with progress
// ABOUTME: Shows course cards with progress bars and continue learning buttons

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react';

interface UserCoursesSectionProps {
  courses: Array<{
    id: string;
    course: {
      id: string;
      title: string;
      description: string;
      thumbnailUrl?: string;
      slug: string;
      product: {
        price: number;
        category?: {
          name: string;
        };
      };
      modules: Array<{
        lessons: Array<{
          id: string;
          completions: Array<{ id: string }>;
        }>;
      }>;
    };
    enrolledAt: Date;
    progress?: {
      progressPercentage: number;
      completedLessons: number;
      totalLessons: number;
    };
  }>;
}

export function UserCoursesSection({ courses }: UserCoursesSectionProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Enrolled Courses</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {courses.length} enrolled
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((enrollment) => (
          <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
        ))}
      </div>
    </section>
  );
}

function EnrolledCourseCard({ enrollment }: { 
  enrollment: {
    id: string;
    course: {
      id: string;
      title: string;
      description: string;
      thumbnailUrl?: string;
      slug: string;
    };
    progress?: {
      progressPercentage: number;
      completedLessons: number;
      totalLessons: number;
    };
  }
}) {
  const { course, progress, enrolledAt, completedAt } = enrollment;
  const product = course.product;
  const isCompleted = completedAt !== null;
  const progressPercentage = Math.round(progress.percentage);

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      {/* Course Image */}
      <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <BookOpen className="w-12 h-12" />
          </div>
        )}
        
        {/* Progress Badge */}
        <div className="absolute top-2 right-2">
          {isCompleted ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {progressPercentage}% Complete
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{progress.totalModules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full gap-2">
            <Play className="w-4 h-4" />
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Button>
        </Link>

        {/* Meta */}
        <div className="text-xs text-gray-500 text-center">
          Enrolled {new Date(enrolledAt).toLocaleDateString()}
          {isCompleted && (
            <span> • Completed {new Date(completedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}