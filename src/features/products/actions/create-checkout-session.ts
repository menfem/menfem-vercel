// ABOUTME: Server action for creating Stripe checkout sessions for products
// ABOUTME: Handles one-time payment processing for courses and digital products

'use server';

import { getStripeInstance } from '@/lib/stripe';
import { getAuth } from '@/features/auth/queries/get-auth';
import { getProduct } from '../queries/get-product';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(productId: string) {
  try {
    const auth = await getAuth();
    
    if (!auth.user) {
      redirect('/sign-in');
    }

    const product = await getProduct(productId);
    
    if (!product || !product.isActive) {
      throw new Error('Product not found or inactive');
    }

    const stripe = getStripeInstance();

    const session = await stripe.checkout.sessions.create({
      customer_email: auth.user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.shortDesc || undefined,
              images: product.images?.slice(0, 1) || [],
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/dashboard?success=purchase&product=${product.slug}`,
      cancel_url: `${process.env.BASE_URL}/products/${product.slug}`,
      metadata: {
        productId: product.id,
        userId: auth.user.id,
        type: 'product_purchase',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Create checkout session error:', error);
    throw new Error('Failed to create checkout session');
  }
}