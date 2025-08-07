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
  formData: FormData
): Promise<ActionState> {
  try {
    // Check authentication
    const { user } = await getAuthOrRedirect();

    // Extract productId from form data
    const productId = formData.get('productId') as string;
    if (!productId) {
      return {
        status: 'ERROR',
        message: 'Product ID is required',
      };
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return {
        status: 'ERROR',
        message: 'Product not found or is no longer available',
      };
    }

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
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.shortDesc || undefined,
            },
            unit_amount: product.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: formData.get('successUrl') as string || `${process.env.BASE_URL}/dashboard?success=subscription`,
      cancel_url: formData.get('cancelUrl') as string || `${process.env.BASE_URL}/pricing`,
      metadata: {
        userId: user.id,
        productId: product.id,
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
  // Create FormData with the predefined premium product
  const formData = new FormData();
  formData.append('productId', 'price_premium_monthly');
  return createSubscriptionCheckout(formData);
}