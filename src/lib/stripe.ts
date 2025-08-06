// ABOUTME: Stripe integration configuration and utilities
// ABOUTME: Handles payment processing and subscription management

import Stripe from 'stripe';

// Only initialize Stripe if not in build mode
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null;

// Runtime check for webhook route
export function getStripeInstance(): Stripe {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }
  return stripe;
}

// Price configurations for products and subscriptions
export const PRICES = {
  PREMIUM_MONTHLY: 'price_premium_monthly', // $20/month
  COURSE_BASIC: 'price_course_basic',       // $999
  COURSE_ADVANCED: 'price_course_advanced', // $1999
} as const;

// Stripe webhook event types we handle
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
} as const;

// Helper to format prices for display
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100);
}

// Helper to convert dollars to cents for Stripe
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// Helper to convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100;
}