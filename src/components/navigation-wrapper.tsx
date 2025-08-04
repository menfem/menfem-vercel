// ABOUTME: Server component wrapper for Navigation that provides auth state
// ABOUTME: Fetches user authentication and passes to client Navigation component

import { getAuth } from '@/features/auth/queries/get-auth';
import { Navigation } from './navigation';
import type { User } from 'lucia';

export async function NavigationWrapper() {
  const { user } = await getAuth();
  
  return <Navigation user={user} />;
}