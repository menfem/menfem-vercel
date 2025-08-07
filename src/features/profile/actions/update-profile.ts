// ABOUTME: Server action for updating user profile information
// ABOUTME: Handles username and email updates with validation and auth checks

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { ActionState } from '@/types/action-state';

const updateProfileSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
});

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { user } = await getAuthOrRedirect();

    const rawData = {
      username: formData.get('username') as string || undefined,
      email: formData.get('email') as string || undefined,
    };

    // Remove empty strings and convert to undefined
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([, value]) => value && value.trim() !== '')
    );

    const validatedData = updateProfileSchema.parse(cleanData);

    // Check if email is already taken by another user
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        return {
          status: 'ERROR' as const,
          message: 'Email is already taken',
        };
      }
    }

    // Check if username is already taken by another user
    if (validatedData.username && validatedData.username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (existingUser && existingUser.id !== user.id) {
        return {
          status: 'ERROR' as const,
          message: 'Username is already taken',
        };
      }
    }

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: validatedData,
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return {
      status: 'SUCCESS' as const,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error instanceof z.ZodError) {
      return {
        status: 'ERROR' as const,
        message: 'Invalid input data',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      status: 'ERROR' as const,
      message: 'Failed to update profile',
    };
  }
}