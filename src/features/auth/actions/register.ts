'use server';

// ABOUTME: Server action for user registration with email verification using Lucia
// ABOUTME: Handles user creation, password hashing, and verification token generation

import { z } from 'zod';
import { generateId } from 'lucia';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '../utils/password';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function register(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = registerSchema.parse({
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        return toActionState('ERROR', 'Email already registered');
      }
      return toActionState('ERROR', 'Username already taken');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user and verification token in transaction
    const { verificationToken } = await prisma.$transaction(async (tx) => {
      const userId = generateId(15);
      const user = await tx.user.create({
        data: {
          id: userId,
          email: data.email,
          username: data.username,
          passwordHash,
        },
      });

      const verificationToken = await tx.emailVerificationToken.create({
        data: {
          token: generateId(40),
          email: data.email,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
        },
      });

      return { user, verificationToken };
    });

    // TODO: Send verification email
    console.log('Verification token:', verificationToken.token);

    return {
      status: 'SUCCESS',
      message: 'Registration successful! Please check your email to verify your account.',
      timestamp: Date.now(),
    };
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}