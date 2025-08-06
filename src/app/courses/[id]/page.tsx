// ABOUTME: Individual course page with course player and lesson navigation
// ABOUTME: Shows course content, progress tracking, and lesson completion

import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getAuth } from '@/features/auth/queries/get-auth';
import { getCourse } from '@/features/courses/queries/get-course';
import { getUserCourseProgress } from '@/features/courses/queries/get-user-course-progress';
import { CoursePlayer } from '@/features/courses/components/course-player';
import { CoursePlayerSkeleton } from '@/features/courses/components/course-player-skeleton';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lessonId?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: `${course.product.name} | MenFem`,
    description: course.product.shortDesc || course.product.description.substring(0, 160),
    openGraph: {
      title: `${course.product.name} | MenFem`,
      description: course.product.shortDesc || course.product.description.substring(0, 160),
      images: course.product.images.length > 0 ? [{ url: course.product.images[0] }] : [],
    },
  };
}

export default async function CoursePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { lessonId } = await searchParams;
  const auth = await getAuth();
  const course = await getCourse(id);

  if (!course || !course.isPublished) {
    notFound();
  }

  // Check if user has access to this course
  if (auth.user) {
    const userProgress = await getUserCourseProgress(auth.user.id, course.id);
    
    if (userProgress) {
      // User is enrolled, show course player
      return (
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<CoursePlayerSkeleton />}>
            <CoursePlayer
              course={course}
              userProgress={userProgress}
              selectedLessonId={lessonId}
            />
          </Suspense>
        </div>
      );
    }
  }

  // User not enrolled or not authenticated, redirect to product page
  redirect(`/products/${course.product.slug}`);
}