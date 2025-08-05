// ABOUTME: Admin courses management page with course overview and management
// ABOUTME: Provides interface for managing courses, modules, lessons, and enrollments

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, GraduationCap, Users, BookOpen, TrendingUp } from 'lucide-react';
import { AdminCoursesList } from '@/features/courses/components/admin/admin-courses-list';
import { getCoursesForAdmin } from '@/features/courses/queries/get-courses';

export default async function AdminCoursesPage() {
  const courses = await getCoursesForAdmin();

  // Calculate summary stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter(course => course.product.isActive).length;
  const totalEnrollments = courses.reduce((sum, course) => sum + course._count.enrollments, 0);
  const totalModules = courses.reduce((sum, course) => sum + course._count.modules, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            Manage your course catalog and student progress
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {activeCourses} active courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Total student enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModules}</div>
            <p className="text-xs text-muted-foreground">
              Course modules created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.length > 0 
                ? Math.round(
                    courses.reduce((sum, course) => {
                      const avgProgress = course.enrollments.reduce((progSum, enrollment) => 
                        progSum + enrollment.progress, 0) / Math.max(course.enrollments.length, 1);
                      return sum + avgProgress;
                    }, 0) / courses.length
                  )
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/products?type=COURSE">
                <GraduationCap className="h-4 w-4 mr-2" />
                Manage Course Products
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/courses/enrollments">
                <Users className="h-4 w-4 mr-2" />
                View Enrollments
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <Suspense fallback={<div>Loading courses...</div>}>
        <AdminCoursesList courses={courses} />
      </Suspense>
    </div>
  );
}