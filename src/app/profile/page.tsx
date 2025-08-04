// ABOUTME: User profile page with profile form, password change, and event history
// ABOUTME: Protected route requiring authentication with comprehensive profile management

import { Suspense } from 'react';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { getUserProfile } from '@/features/profile/queries/get-user-profile';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { PasswordForm } from '@/features/profile/components/password-form';
import { EventHistory } from '@/features/profile/components/event-history';
import { NavigationWrapper } from '@/components/navigation-wrapper';
import { notFound } from 'next/navigation';

function ProfilePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

async function ProfileContent() {
  const { user } = await getAuthOrRedirect();
  
  const userProfile = await getUserProfile(user.id);
  
  if (!userProfile) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border p-6">
          <ProfileForm user={userProfile} />
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <PasswordForm />
        </div>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <EventHistory user={userProfile} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-brown mb-2">Profile Settings</h1>
            <p className="text-gray-700">
              Manage your account settings, view your event history, and update your preferences.
            </p>
          </div>
          
          <Suspense fallback={<ProfilePageSkeleton />}>
            <ProfileContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}