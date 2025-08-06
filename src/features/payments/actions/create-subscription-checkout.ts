// ABOUTME: Server action for creating subscription checkout sessions
// ABOUTME: Handles premium membership subscription payments

'use server';

import { getStripeInstance } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';

export async function createSubscriptionCheckout(
  priceId: string
): Promise<ActionState> {
  try {
    // Check authentication
    const { user } = await getAuthOrRedirect();

    // Check if user already has an active subscription
    const existingSubscription = await prisma.membershipSubscription.findUnique({
      where: { userId: user.id },
    });

    if (existingSubscription && existingSubscription.status === 'ACTIVE') {
      return {
        status: 'ERROR',
        message: 'You already have an active subscription',
      };
    }

    // Create Stripe checkout session for subscription
    const stripe = getStripeInstance();
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use predefined price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL}/dashboard?success=subscription`,
      cancel_url: `${process.env.BASE_URL}/pricing`,
      metadata: {
        userId: user.id,
        subscriptionType: 'premium',
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    });

    if (!session.url) {
      return {
        status: 'ERROR',
        message: 'Failed to create subscription checkout session',
      };
    }

    return toActionState('SUCCESS', 'Subscription checkout created', {
      sessionUrl: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Create subscription checkout error:', error);
    
    if (error instanceof Error && error.message.includes('Stripe')) {
      return {
        status: 'ERROR',
        message: 'Payment system error. Please try again.',
      };
    }
    
    return {
      status: 'ERROR',
      message: 'Failed to create subscription checkout',
    };
  }
}

export async function createPremiumSubscriptionCheckout(): Promise<ActionState> {
  // Use the predefined premium monthly price
  return createSubscriptionCheckout('price_premium_monthly');
}