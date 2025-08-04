// ABOUTME: Admin authentication query with automatic redirect
// ABOUTME: Ensures user is authenticated and has admin privileges

import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/queries/get-auth';
import { isAdmin } from '../utils/is-admin';
import type { User } from 'lucia';

export async function getAdminOrRedirect(): Promise<{ user: User }> {
  const { user } = await getAuth();
  
  if (!user) {
    redirect('/sign-in?from=/admin');
  }
  
  if (!isAdmin(user)) {
    redirect('/dashboard'); // Redirect non-admin users to regular dashboard
  }
  
  return { user };
}