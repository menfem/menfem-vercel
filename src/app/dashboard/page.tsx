// ABOUTME: User dashboard page with personalized stats and quick access
// ABOUTME: Protected route showing user overview, upcoming events, and navigation

import { Suspense } from 'react';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { getUserProfile, getUserStats } from '@/features/profile/queries/get-user-profile';
import { UserDashboard } from '@/features/profile/components/user-dashboard';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { notFound } from 'next/navigation';

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  );
}

async function DashboardContent() {
  const { user } = await getAuthOrRedirect();
  
  const [userProfile, userStats] = await Promise.all([
    getUserProfile(user.id),
    getUserStats(user.id),
  ]);
  
  if (!userProfile) {
    notFound();
  }

  return <UserDashboard user={userProfile} stats={userStats} />;
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}