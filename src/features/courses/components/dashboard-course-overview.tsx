// ABOUTME: Dashboard course overview with progress tracking and quick access
// ABOUTME: Displays user's enrolled courses with completion status and next actions

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Clock, CheckCircle, ArrowRight, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardCourseOverviewProps {
  enrolledCourses: Array<{
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    lastAccessedAt?: Date;
    estimatedTimeRemaining?: string;
    nextLesson?: {
      id: string;
      title: string;
      moduleTitle: string;
    };
    completedAt?: Date;
  }>;
  recentActivity?: Array<{
    id: string;
    type: 'lesson_completed' | 'course_started' | 'certificate_earned';
    courseTitle: string;
    lessonTitle?: string;
    timestamp: Date;
  }>;
}

export function DashboardCourseOverview({ 
  enrolledCourses, 
  recentActivity = [] 
}: DashboardCourseOverviewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = enrolledCourses.filter(course => {
    switch (selectedFilter) {
      case 'in-progress':
        return course.progress > 0 && course.progress < 100;
      case 'completed':
        return course.progress >= 100;
      default:
        return true;
    }
  });

  const completedCount = enrolledCourses.filter(c => c.progress >= 100).length;
  const inProgressCount = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length;
  const totalHoursLearned = enrolledCourses.reduce((acc, course) => {
    // Estimate based on completion percentage and average lesson time
    return acc + (course.completedLessons * 0.5); // Assume 30min per lesson
  }, 0);

  const formatLastAccessed = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const formatActivityTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalHoursLearned)}</p>
              <p className="text-sm text-gray-600">Hours Learned</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Courses', count: enrolledCourses.length },
            { key: 'in-progress', label: 'In Progress', count: inProgressCount },
            { key: 'completed', label: 'Completed', count: completedCount }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key as 'all' | 'in-progress' | 'completed')}
              className="text-xs"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Course Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                </div>
                {course.thumbnailUrl && (
                  <div className="relative w-16 h-16 ml-4">
                    <Image 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="rounded-lg object-cover"
                      fill
                    />
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <Badge variant={course.progress >= 100 ? "default" : "secondary"}>
                    {course.progress >= 100 ? "Completed" : `${Math.round(course.progress)}%`}
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                  {course.estimatedTimeRemaining && course.progress < 100 && (
                    <span>{course.estimatedTimeRemaining} remaining</span>
                  )}
                </div>
              </div>

              {/* Last Activity */}
              {course.lastAccessedAt && (
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last accessed {formatLastAccessed(course.lastAccessedAt)}
                </div>
              )}

              {/* Next Lesson or Completion */}
              {course.progress >= 100 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Course Completed!</span>
                  </div>
                  <Link href={`/courses/${course.id}/certificate`}>
                    <Button size="sm" variant="outline">
                      View Certificate
                    </Button>
                  </Link>
                </div>
              ) : course.nextLesson ? (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Next Lesson</p>
                      <p className="text-sm font-medium text-blue-900">{course.nextLesson.title}</p>
                      <p className="text-xs text-blue-700">in {course.nextLesson.moduleTitle}</p>
                    </div>
                    <Link href={`/courses/${course.id}?lessonId=${course.nextLesson.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Continue
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link href={`/courses/${course.id}`}>
                  <Button size="sm" className="w-full">
                    {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedFilter === 'all' ? 'No courses enrolled' : `No ${selectedFilter} courses`}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedFilter === 'all' 
              ? 'Start your learning journey by enrolling in a course'
              : `You don't have any ${selectedFilter} courses yet`
            }
          </p>
          <Link href="/products">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 py-2">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  activity.type === 'lesson_completed' && "bg-green-100",
                  activity.type === 'course_started' && "bg-blue-100",
                  activity.type === 'certificate_earned' && "bg-yellow-100"
                )}>
                  {activity.type === 'lesson_completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activity.type === 'course_started' && <BookOpen className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'certificate_earned' && <Trophy className="h-4 w-4 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {activity.type === 'lesson_completed' && `Completed "${activity.lessonTitle}"`}
                    {activity.type === 'course_started' && `Started "${activity.courseTitle}"`}
                    {activity.type === 'certificate_earned' && `Earned certificate for "${activity.courseTitle}"`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.courseTitle}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {formatActivityTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}