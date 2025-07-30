// ABOUTME: Core authentication query functions using Lucia
// ABOUTME: Provides cached auth checks with Lucia's session validation

import { cache } from 'react';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/lucia';
import type { User, Session } from 'lucia';

export type AuthResult = {
  user: User | null;
  session: Session | null;
};

export const getAuth = cache(async (): Promise<AuthResult> => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {}

  return result;
});