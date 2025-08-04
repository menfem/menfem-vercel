// ABOUTME: Admin layout with authentication and navigation
// ABOUTME: Provides admin-only access and consistent admin interface

import { getAdminOrRedirect } from '@/features/admin/queries/get-admin-or-redirect';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is admin, redirect if not
  await getAdminOrRedirect();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}