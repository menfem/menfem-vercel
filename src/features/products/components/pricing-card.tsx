// ABOUTME: Pricing card component with Stripe checkout integration
// ABOUTME: Handles subscription and one-time payment processing

'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '../actions/create-checkout-session';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PricingCardProps {
  type: 'subscription' | 'one-time';
  price: number; // in cents
  productId?: string;
  priceId?: string; // For Stripe price ID
  buttonText?: string;
  className?: string;
}

export function PricingCard({
  type,
  price,
  productId,
  priceId,
  buttonText = 'Get Started',
  className
}: PricingCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      try {
        let result;
        
        if (type === 'subscription') {
          // Create subscription checkout
          result = await createSubscriptionCheckout(priceId || 'price_1QSGGw02z6oR9gRZwVAo2xSH');
        } else if (productId) {
          // Create product checkout
          result = await createCheckoutSession(productId);
        } else {
          throw new Error('Missing required checkout parameters');
        }

        if (result.url) {
          window.location.href = result.url;
        } else {
          throw new Error('Failed to create checkout session');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to start checkout. Please try again.');
      }
    });
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isPending}
      className={className}
      size="lg"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}

// Helper function for subscription checkout
async function createSubscriptionCheckout(priceId: string) {
  const response = await fetch('/api/checkout/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription checkout');
  }

  return response.json();
}