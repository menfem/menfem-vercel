// ABOUTME: Courses page displaying user's enrolled courses and available courses
// ABOUTME: Shows course progress, enrollment status, and course catalog

import { Suspense } from 'react';
import { getAuth } from '@/features/auth/queries/get-auth';
import { getUserCourses } from '@/features/courses/queries/get-user-courses';
import { getCourses } from '@/features/courses/queries/get-courses';
import { UserCoursesSection } from '@/features/courses/components/user-courses-section';
import { AvailableCoursesSection } from '@/features/courses/components/available-courses-section';
import { CoursesSkeleton } from '@/features/courses/components/courses-skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses | MenFem',
  description: 'Access your enrolled courses and discover new learning opportunities for personal development and growth.',
  openGraph: {
    title: 'Courses | MenFem',
    description: 'Access your enrolled courses and discover new learning opportunities for personal development and growth.',
  },
};

export default async function CoursesPage() {
  const auth = await getAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {auth.user ? 'My Courses' : 'Available Courses'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {auth.user 
              ? 'Continue your learning journey with your enrolled courses'
              : 'Discover comprehensive courses designed for personal development and growth'
            }
          </p>
        </div>

        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesContent user={auth.user} />
        </Suspense>
      </div>
    </div>
  );
}

async function CoursesContent({ user }: { user: { id: string } | null }) {
  if (user) {
    // Show enrolled courses and available courses
    const [userCourses, availableCourses] = await Promise.all([
      getUserCourses(user.id),
      getCourses({ isPublished: true, limit: 6 }),
    ]);

    return (
      <div className="space-y-12">
        {userCourses.length > 0 && (
          <UserCoursesSection courses={userCourses} />
        )}
        
        <AvailableCoursesSection 
          courses={availableCourses.list}
          enrolledCourseIds={userCourses.map(uc => uc.course.id)}
          showHeader={userCourses.length > 0}
        />
      </div>
    );
  } else {
    // Show available courses only
    const availableCourses = await getCourses({ 
      isPublished: true,
      limit: 12 
    });

    return (
      <AvailableCoursesSection 
        courses={availableCourses.list}
        enrolledCourseIds={[]}
        showHeader={false}
      />
    );
  }
}