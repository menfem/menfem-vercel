'use server';

// ABOUTME: Server action for user sign out and session cleanup using Lucia
// ABOUTME: Removes session from database and clears session cookie

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/lucia';
import { getAuth } from '../queries/get-auth';
import { PATHS } from '@/paths';

export async function signOut() {
  const { session } = await getAuth();

  if (session) {
    await lucia.invalidateSession(session.id);
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  
  redirect(PATHS.HOME);
}