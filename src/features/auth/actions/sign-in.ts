'use server';

// ABOUTME: Server action for user authentication and session creation using Lucia
// ABOUTME: Validates credentials and establishes authenticated session

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { lucia } from '@/lib/lucia';
import { verifyPassword } from '../utils/password';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { PATHS } from '@/paths';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function signIn(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return toActionState('ERROR', 'Invalid email or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.passwordHash);

    if (!isValidPassword) {
      return toActionState('ERROR', 'Invalid email or password');
    }

    // Create session using Lucia
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  // Redirect after successful sign in
  redirect(PATHS.HOME);
}