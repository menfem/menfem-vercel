// ABOUTME: Admin page for creating new courses
// ABOUTME: Form interface for creating courses linked to course products

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminCourseForm } from '@/features/courses/components/admin/admin-course-form';
import { getProducts } from '@/features/products/queries/get-products';

export default async function NewCoursePage() {
  // Get course products for the form
  const courseProducts = await getProducts({ type: 'COURSE', isActive: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Set up course structure and learning objectives
          </p>
        </div>
      </div>

      {/* Info Card */}
      {courseProducts.list.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-medium">No Course Products Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You need to create a course product first before you can create a course.
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/admin/products/new">
                    Create Course Product
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCourseForm courseProducts={courseProducts.list} />
        </CardContent>
      </Card>
    </div>
  );
}