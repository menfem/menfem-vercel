// ABOUTME: Purchase button component with Stripe checkout integration
// ABOUTME: Handles product purchases and subscription sign-ups with loading states

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/features/payments/actions/create-checkout-session';
import { createSubscriptionCheckout } from '@/features/payments/actions/create-subscription-checkout';
import { formatPrice } from '../utils/format-price';
import type { ProductListItem } from '../types';
import { ShoppingCart, Crown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PurchaseButtonProps {
  product: ProductListItem;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function PurchaseButton({ 
  product, 
  className,
  size = 'default'
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      let checkoutUrl: string;
      
      if (product.type === 'SUBSCRIPTION') {
        const formData = new FormData();
        formData.append('productId', product.id);
        formData.append('successUrl', `/products/${product.slug}?success=true`);
        
        const result = await createSubscriptionCheckout(formData);
        
        if (result.status === 'SUCCESS' && result.payload) {
          const payload = result.payload as { sessionUrl: string };
          checkoutUrl = payload.sessionUrl;
        } else {
          throw new Error(result.message || 'Failed to create checkout');
        }
      } else {
        const formData = new FormData();
        formData.append('productId', product.id);
        formData.append('successUrl', `/products/${product.slug}?success=true`);
        
        const result = await createCheckoutSession(formData);
        
        if (result.status === 'SUCCESS' && result.payload) {
          const payload = result.payload as { sessionUrl: string };
          checkoutUrl = payload.sessionUrl;
        } else {
          throw new Error(result.message || 'Failed to create checkout');
        }
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      // Show error toast
      alert('Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if product is available
  const isAvailable = product.isActive && 
    (product.type !== 'PHYSICAL' || (product.stock && product.stock > 0));

  const getButtonText = () => {
    if (isLoading) {
      return 'Processing...';
    }

    switch (product.type) {
      case 'SUBSCRIPTION':
        return `Subscribe - ${formatPrice(product.price)}/mo`;
      case 'COURSE':
        return `Enroll Now - ${formatPrice(product.price)}`;
      case 'DIGITAL':
        return `Buy Now - ${formatPrice(product.price)}`;
      case 'PHYSICAL':
        return `Add to Cart - ${formatPrice(product.price)}`;
      default:
        return `Buy Now - ${formatPrice(product.price)}`;
    }
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    switch (product.type) {
      case 'SUBSCRIPTION':
        return <Crown className="w-4 h-4" />;
      case 'COURSE':
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  if (!isAvailable) {
    return (
      <Button 
        disabled 
        variant="outline" 
        size={size}
        className={cn("gap-2", className)}
      >
        {product.type === 'PHYSICAL' ? 'Out of Stock' : 'Unavailable'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      size={size}
      className={cn(
        "gap-2",
        product.type === 'SUBSCRIPTION' 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
          : "bg-blue-600 hover:bg-blue-700",
        className
      )}
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
}