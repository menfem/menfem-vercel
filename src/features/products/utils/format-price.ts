// ABOUTME: Utility functions for formatting prices and currency
// ABOUTME: Handles price display, calculations, and currency formatting

import { CURRENCY_CONFIG } from '../constants';

/**
 * Formats price in cents to currency string
 */
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    style: 'currency',
    currency: CURRENCY_CONFIG.CURRENCY,
  }).format(priceInCents / 100);
}

/**
 * Formats price without currency symbol
 */
export function formatPriceNumber(priceInCents: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInCents / 100);
}

/**
 * Converts dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Converts cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Calculates discount percentage
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Formats discount percentage for display
 */
export function formatDiscountPercentage(
  originalPrice: number,
  salePrice: number
): string {
  const discount = calculateDiscountPercentage(originalPrice, salePrice);
  return discount > 0 ? `${discount}% off` : '';
}

/**
 * Formats price range for display
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  
  if (maxPrice === Infinity) {
    return `${formatPrice(minPrice)}+`;
  }
  
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Validates price input
 */
export function isValidPrice(price: number): boolean {
  return price >= 0 && Number.isFinite(price) && Number.isInteger(price);
}

/**
 * Parses price string to cents
 */
export function parsePriceInput(priceString: string): number | null {
  const cleaned = priceString.replace(/[^0-9.]/g, '');
  const price = parseFloat(cleaned);
  
  if (isNaN(price)) return null;
  
  return dollarsToCents(price);
}

/**
 * Formats price for form input
 */
export function formatPriceForInput(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2);
}

/**
 * Gets price color class based on discount
 */
export function getPriceColorClass(hasDiscount: boolean): string {
  return hasDiscount ? 'text-red-600' : 'text-gray-900';
}

/**
 * Gets original price styling when on sale
 */
export function getOriginalPriceClass(): string {
  return 'text-gray-500 line-through text-sm';
}