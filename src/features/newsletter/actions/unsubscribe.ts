'use server';

// ABOUTME: Server action for newsletter unsubscription
// ABOUTME: Handles unsubscription with soft delete approach

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function unsubscribeFromNewsletter(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = unsubscribeSchema.parse({
      email: formData.get('email'),
    });

    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email: data.email },
    });

    if (!subscription) {
      return toActionState('ERROR', 'Email not found in our subscription list');
    }

    if (!subscription.isActive) {
      return toActionState('ERROR', 'This email is already unsubscribed');
    }

    // Soft delete - mark as inactive
    await prisma.newsletterSubscription.update({
      where: { id: subscription.id },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return toActionState(
      'SUCCESS',
      'You have been successfully unsubscribed from our newsletter.'
    );
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}