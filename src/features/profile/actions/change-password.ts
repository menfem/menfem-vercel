// ABOUTME: Server action for changing user password with current password verification
// ABOUTME: Validates current password before allowing new password update

'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { verifyPassword, hashPassword } from '@/features/auth/utils/password';
import { ActionState } from '@/types/action-state';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function changePassword(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { user } = await getAuthOrRedirect();

    const rawData = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const validatedData = changePasswordSchema.parse(rawData);

    // Fetch full user data for password hash
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!fullUser) {
      return {
        status: 'ERROR' as const,
        message: 'User not found',
      };
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      fullUser.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return {
        status: 'ERROR' as const,
        message: 'Current password is incorrect',
        fieldErrors: {
          currentPassword: ['Current password is incorrect'],
        },
      };
    }

    // Hash new password
    const newPasswordHash = await hashPassword(validatedData.newPassword);

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return {
      status: 'SUCCESS' as const,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Error changing password:', error);
    
    if (error instanceof z.ZodError) {
      return {
        status: 'ERROR' as const,
        message: 'Invalid input data',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      status: 'ERROR' as const,
      message: 'Failed to change password',
    };
  }
}