'use server';

// ABOUTME: Server action for email verification token validation using Lucia
// ABOUTME: Confirms user email and removes used verification token

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';
import { PATHS } from '@/paths';

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export async function verifyEmail(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = verifyEmailSchema.parse({
      token: formData.get('token'),
    });

    // Find token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token: data.token },
    });

    if (!verificationToken) {
      return toActionState('ERROR', 'Invalid verification token');
    }

    // Check if expired
    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return toActionState('ERROR', 'Verification token has expired');
    }

    // Update user and delete token in transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      });

      await tx.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
    });

  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(PATHS.AUTH.SIGN_IN + '?verified=true');
}