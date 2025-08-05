// ABOUTME: Stripe webhook handler for payment and subscription events
// ABOUTME: Processes payments, subscriptions, and enrollment automation

import { getStripeInstance, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return new NextResponse('Missing signature', { status: 400 });
  }

  let event: any;

  try {
    const stripe = getStripeInstance();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_COMPLETED:
        await handleCheckoutCompleted(event.data.object);
        break;
      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object);
        break;
      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object);
        break;
      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object);
        break;
      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        await handlePaymentSucceeded(event.data.object);
        break;
      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return new NextResponse('Webhook error', { status: 500 });
  }
}

async function handleCheckoutCompleted(session: any) {
  const { metadata, payment_intent, amount_total, mode } = session;
  
  if (!metadata?.productId || !metadata?.userId) {
    console.error('Missing required metadata in checkout session');
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Create purchase record
    const purchase = await tx.purchase.create({
      data: {
        userId: metadata.userId,
        productId: metadata.productId,
        stripePaymentId: payment_intent,
        amount: amount_total,
        status: 'COMPLETED',
      },
    });

    // Get product details to determine if it's a course
    const product = await tx.product.findUnique({
      where: { id: metadata.productId },
      include: { course: true },
    });

    // If it's a course, create enrollment
    if (product?.type === 'COURSE' && product.course) {
      await tx.courseEnrollment.create({
        data: {
          userId: metadata.userId,
          courseId: product.course.id,
        },
      });
    }

    // If it's a subscription (premium membership)
    if (mode === 'subscription') {
      await tx.membershipSubscription.upsert({
        where: { userId: metadata.userId },
        create: {
          userId: metadata.userId,
          stripeCustomerId: session.customer,
          stripeSubId: session.subscription,
          status: 'ACTIVE',
        },
        update: {
          stripeSubId: session.subscription,
          status: 'ACTIVE',
        },
      });
    }
  });

  console.log(`Purchase completed for user ${metadata.userId}, product ${metadata.productId}`);
}

async function handleSubscriptionCreated(subscription: any) {
  const { customer, id: subscriptionId } = subscription;
  
  // Find user by Stripe customer ID
  const membershipSub = await prisma.membershipSubscription.findUnique({
    where: { stripeCustomerId: customer },
  });

  if (membershipSub) {
    await prisma.membershipSubscription.update({
      where: { id: membershipSub.id },
      data: {
        stripeSubId: subscriptionId,
        status: 'ACTIVE',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  console.log(`Subscription created: ${subscriptionId}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  const { id: subscriptionId, status, current_period_end } = subscription;
  
  const membershipSub = await prisma.membershipSubscription.findUnique({
    where: { stripeSubId: subscriptionId },
  });

  if (membershipSub) {
    await prisma.membershipSubscription.update({
      where: { id: membershipSub.id },
      data: {
        status: mapStripeStatusToPrisma(status),
        currentPeriodEnd: new Date(current_period_end * 1000),
      },
    });
  }

  console.log(`Subscription updated: ${subscriptionId}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const { id: subscriptionId } = subscription;
  
  const membershipSub = await prisma.membershipSubscription.findUnique({
    where: { stripeSubId: subscriptionId },
  });

  if (membershipSub) {
    await prisma.membershipSubscription.update({
      where: { id: membershipSub.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });
  }

  console.log(`Subscription cancelled: ${subscriptionId}`);
}

async function handlePaymentSucceeded(invoice: any) {
  const { subscription: subscriptionId } = invoice;
  
  if (subscriptionId) {
    const membershipSub = await prisma.membershipSubscription.findUnique({
      where: { stripeSubId: subscriptionId },
    });

    if (membershipSub) {
      await prisma.membershipSubscription.update({
        where: { id: membershipSub.id },
        data: {
          status: 'ACTIVE',
        },
      });
    }
  }

  console.log(`Payment succeeded for subscription: ${subscriptionId}`);
}

async function handlePaymentFailed(invoice: any) {
  const { subscription: subscriptionId } = invoice;
  
  if (subscriptionId) {
    const membershipSub = await prisma.membershipSubscription.findUnique({
      where: { stripeSubId: subscriptionId },
    });

    if (membershipSub) {
      await prisma.membershipSubscription.update({
        where: { id: membershipSub.id },
        data: {
          status: 'PAST_DUE',
        },
      });
    }
  }

  console.log(`Payment failed for subscription: ${subscriptionId}`);
}

function mapStripeStatusToPrisma(stripeStatus: string) {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'canceled':
      return 'CANCELLED';
    case 'past_due':
      return 'PAST_DUE';
    default:
      return 'INACTIVE';
  }
}