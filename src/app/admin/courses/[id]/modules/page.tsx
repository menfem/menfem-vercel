// ABOUTME: Admin page for managing course modules and lessons
// ABOUTME: Provides interface for organizing course content structure

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminCourseModulesList } from '@/features/courses/components/admin/admin-course-modules-list';
import { getCourse } from '@/features/courses/queries/get-course';

interface CourseModulesPageProps {
  params: {
    id: string;
  };
}

export default async function CourseModulesPage({ params }: CourseModulesPageProps) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  // Calculate stats
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const publishedModules = course.modules.filter(m => m.isPublished).length;
  const publishedLessons = course.modules.reduce((sum, module) => 
    sum + module.lessons.filter(l => l.isPublished).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">{course.product.name}</h1>
            <p className="text-muted-foreground">
              Manage course modules and lessons
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href={`/admin/courses/${course.id}/modules/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Link>
        </Button>
      </div>

      {/* Course Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course._count.modules}</div>
            <p className="text-xs text-muted-foreground">
              {publishedModules} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              {publishedLessons} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Level</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              {course.duration}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course._count.enrollments}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Syllabus */}
      <Card>
        <CardHeader>
          <CardTitle>Course Syllabus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {course.syllabus}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle>Course Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading modules...</div>}>
            <AdminCourseModulesList 
              modules={course.modules}
              courseId={course.id}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}