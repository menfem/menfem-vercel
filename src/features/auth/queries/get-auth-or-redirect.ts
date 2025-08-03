// ABOUTME: Authentication query with automatic redirect for protected routes
// ABOUTME: Ensures user is authenticated and optionally verified before access

import { redirect } from 'next/navigation';
import { getAuth } from './get-auth';
import { PATHS } from '@/paths';

type GetAuthOptions = {
  checkEmailVerified?: boolean;
};

export async function getAuthOrRedirect(options?: GetAuthOptions) {
  const { user, session } = await getAuth();

  if (!user || !session) {
    redirect(PATHS.AUTH.SIGN_IN);
  }

  if (options?.checkEmailVerified !== false && !user.emailVerified) {
    redirect(PATHS.AUTH.VERIFY_EMAIL);
  }

  return { user, session };
}