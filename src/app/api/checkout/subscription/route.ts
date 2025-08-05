// ABOUTME: API route for creating Stripe subscription checkout sessions
// ABOUTME: Handles premium subscription sign-ups with proper user authentication

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAuth } from '@/features/auth/queries/get-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    const auth = await getAuth();

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Check if user already has active subscription
    const existingSubscription = await prisma.membershipSubscription.findUnique({
      where: { userId: auth.user.id },
    });

    if (existingSubscription?.status === 'ACTIVE') {
      return NextResponse.json(
        { error: 'User already has active subscription' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: auth.user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL}/dashboard?success=subscription`,
      cancel_url: `${process.env.BASE_URL}/pricing`,
      metadata: {
        userId: auth.user.id,
        type: 'premium_subscription',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Subscription checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}