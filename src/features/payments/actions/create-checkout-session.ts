// ABOUTME: Server action for creating Stripe checkout sessions
// ABOUTME: Handles payment session creation for product purchases

'use server';

import { getStripeInstance } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import type { ActionState } from '@/types/action-state';
import { createCheckoutSessionSchema } from '@/features/products/schema/product';

export async function createCheckoutSession(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Check authentication
    const { user } = await getAuthOrRedirect();

    // Parse and validate form data
    const rawData = {
      productId: formData.get('productId') as string,
      successUrl: formData.get('successUrl') as string || `${process.env.BASE_URL}/dashboard?success=true`,
      cancelUrl: formData.get('cancelUrl') as string || `${process.env.BASE_URL}/products`,
    };

    const validatedData = createCheckoutSessionSchema.parse(rawData);

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      include: {
        category: true,
      },
    });

    if (!product || !product.isActive) {
      return {
        status: 'ERROR',
        message: 'Product not found or is no longer available',
      };
    }

    // Check stock for physical products
    if (!product.isDigital && product.stock !== null && product.stock <= 0) {
      return {
        status: 'ERROR',
        message: 'Product is out of stock',
      };
    }

    // Check if user already purchased this product
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        productId: product.id,
        status: 'COMPLETED',
      },
    });

    if (existingPurchase && product.type !== 'SUBSCRIPTION') {
      return {
        status: 'ERROR',
        message: 'You have already purchased this product',
      };
    }

    // Determine session mode
    const mode = product.type === 'SUBSCRIPTION' ? 'subscription' : 'payment';

    // Create Stripe checkout session
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
              images: product.images.slice(0, 8), // Stripe allows max 8 images
            },
            unit_amount: product.price,
            ...(mode === 'subscription' && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode,
      success_url: validatedData.successUrl,
      cancel_url: validatedData.cancelUrl,
      metadata: {
        productId: product.id,
        userId: user.id,
        productType: product.type,
      },
      // For subscriptions, we might want to add a trial period
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: {
            productId: product.id,
            userId: user.id,
          },
        },
      }),
    });

    if (!session.url) {
      return {
        status: 'ERROR',
        message: 'Failed to create checkout session',
      };
    }

    return toActionState('SUCCESS', 'Checkout session created', {
      sessionUrl: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    
    if (error instanceof Error && error.message.includes('Stripe')) {
      return {
        status: 'ERROR',
        message: 'Payment system error. Please try again.',
      };
    }
    
    return fromErrorToActionState(error, formData);
  }
}