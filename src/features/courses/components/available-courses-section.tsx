// ABOUTME: Available courses section displaying courses for enrollment
// ABOUTME: Shows course catalog with enrollment buttons and course details

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/features/products/utils/format-price';
import { PurchaseButton } from '@/features/products/components/purchase-button';
import { BookOpen, Clock, Users } from 'lucide-react';
import type { CourseWithRelations } from '../types';

interface AvailableCoursesProps {
  courses: CourseWithRelations[];
  enrolledCourseIds: string[];
  showHeader?: boolean;
}

export function AvailableCoursesSection({ 
  courses, 
  enrolledCourseIds,
  showHeader = true 
}: AvailableCoursesProps) {
  if (courses.length === 0) {
    return (
      <section className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No courses available
        </h3>
        <p className="text-gray-600">
          Check back later for new learning opportunities.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
          <Link href="/products?type=COURSE">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <AvailableCourseCard 
            key={course.id} 
            course={course}
            isEnrolled={enrolledCourseIds.includes(course.id)}
          />
        ))}
      </div>
    </section>
  );
}

function AvailableCourseCard({ 
  course, 
  isEnrolled 
}: { 
  course: CourseWithRelations;
  isEnrolled: boolean;
}) {
  const product = course.product;

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
        
        {/* Enrollment Status */}
        {isEnrolled && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-green-600">
              Enrolled
            </Badge>
          </div>
        )}
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
          
          <Link href={`/courses/${course.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          {product.shortDesc && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.shortDesc}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.modules.length} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{product._count?.purchases || 0} enrolled</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isEnrolled ? (
            <Link href={`/courses/${course.id}`}>
              <Button className="w-full">
                Access Course
              </Button>
            </Link>
          ) : (
            <PurchaseButton 
              product={product} 
              className="w-full"
            />
          )}
          
          <Link href={`/courses/${course.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}