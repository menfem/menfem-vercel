'use server';

// ABOUTME: Server action for newsletter subscription with double opt-in
// ABOUTME: Handles both anonymous and authenticated user subscriptions

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { getAuth } from '@/features/auth/queries/get-auth';
import { sendEmail } from '@/lib/resend';
import { NewsletterConfirmationEmail } from '@/emails/newsletter-confirmation';
import { PATHS } from '@/paths';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function subscribeToNewsletter(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = subscribeSchema.parse({
      email: formData.get('email'),
    });

    const { user } = await getAuth();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      if (existing.isActive) {
        return toActionState('ERROR', 'This email is already subscribed');
      }
      
      // Reactivate subscription
      await prisma.newsletterSubscription.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          unsubscribedAt: null,
          userId: user?.id || existing.userId,
        },
      });

      // Send welcome back email (optional - doesn't fail if it errors)
      try {
        await sendEmail({
          to: data.email,
          subject: 'Welcome back to MenFem!',
          react: NewsletterConfirmationEmail({
            userEmail: data.email,
            userName: user?.username || undefined,
            confirmationUrl: `${process.env.BASE_URL}/articles`, // Direct to articles since already confirmed
          }),
        });
      } catch (emailError) {
        console.error('Failed to send welcome back email:', emailError);
      }

      return toActionState('SUCCESS', 'Welcome back! Your subscription has been reactivated.');
    }

    // Create new subscription
    const confirmationToken = nanoid(32);
    
    await prisma.newsletterSubscription.create({
      data: {
        email: data.email,
        userId: user?.id,
        confirmationToken,
      },
    });

    // Send confirmation email
    try {
      const confirmationUrl = `${process.env.BASE_URL}${PATHS.NEWSLETTER.CONFIRM(confirmationToken)}`;
      
      await sendEmail({
        to: data.email,
        subject: 'Confirm your MenFem newsletter subscription',
        react: NewsletterConfirmationEmail({
          userEmail: data.email,
          userName: user?.username || undefined,
          confirmationUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the subscription if email fails - user can try again
    }

    return toActionState(
      'SUCCESS',
      'Success! Please check your email to confirm your subscription.'
    );
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
}