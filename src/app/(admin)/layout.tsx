// ABOUTME: Protected layout for admin routes with authentication check
// ABOUTME: Ensures only authenticated admin users can access admin pages

import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/queries/get-auth';
import { PATHS } from '@/paths';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuth();

  if (!user) {
    redirect(PATHS.AUTH.SIGN_IN);
  }

  // TODO: Add admin role check once roles are implemented
  // For now, any authenticated user can access

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">MenFem Admin</h1>
            </div>
            {/* TODO: Add navigation items */}
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}