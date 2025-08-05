// ABOUTME: Admin courses list component with course management actions
// ABOUTME: Displays courses in a card layout with modules, lessons, and enrollment info

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Edit, 
  Eye, 
  Users, 
  BookOpen, 
  Video, 
  Settings,
  GraduationCap,
  TrendingUp 
} from 'lucide-react';
import { formatPrice } from '@/features/products/utils/format-price';
import { format } from 'date-fns';
import type { CourseWithRelations } from '../../types';

interface AdminCoursesListProps {
  courses: CourseWithRelations[];
}

export function AdminCoursesList({ courses }: AdminCoursesListProps) {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create your first course to start building your educational content.
          </p>
          <Button asChild>
            <Link href="/admin/courses/new">Create Course</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: CourseWithRelations }) {
  const hasImages = course.product.images && course.product.images.length > 0;
  const primaryImage = hasImages ? course.product.images[0] : null;
  
  // Calculate course stats
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const avgProgress = course.enrollments.length > 0
    ? course.enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / course.enrollments.length
    : 0;
  
  const completedEnrollments = course.enrollments.filter(e => e.completedAt).length;

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {/* Course Image */}
        <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={course.product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <GraduationCap className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Status Overlay */}
          <div className="absolute top-2 left-2 flex gap-1">
            {!course.product.isActive && (
              <Badge variant="secondary">Inactive</Badge>
            )}
            <Badge variant="outline">
              {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70 text-white">
              {formatPrice(course.product.price)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Course Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {course.product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {course.duration}
            </p>
          </div>

          {/* Course Structure */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course._count.modules} modules</span>
            </div>
            <div className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>

          {/* Enrollment Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{course._count.enrollments} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>{completedEnrollments} completed</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg. Progress</span>
                <span className="font-medium">{Math.round(avgProgress)}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
            </div>
          </div>

          {/* Module Preview */}
          {course.modules.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Latest Modules:</p>
              <div className="space-y-1">
                {course.modules.slice(0, 2).map((module) => (
                  <div key={module.id} className="flex items-center justify-between text-xs">
                    <span className="line-clamp-1">{module.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {module.lessons.length} lessons
                    </Badge>
                  </div>
                ))}
                {course.modules.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{course.modules.length - 2} more modules
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {/* View Course */}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/courses/${course.product.slug}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/courses/${course.id}/modules`}>
              <BookOpen className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/courses/${course.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/courses/${course.id}/settings`}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}