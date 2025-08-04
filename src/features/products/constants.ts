// ABOUTME: Constants and configuration for the products feature
// ABOUTME: Centralized constants for product management and e-commerce

export const PRODUCT_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // Price limits (in cents)
  MIN_PRICE: 100, // $1.00
  MAX_PRICE: 100000000, // $1,000,000.00
  
  // Image handling
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Stock management
  LOW_STOCK_THRESHOLD: 10,
  OUT_OF_STOCK: 0,
  
  // Slug generation
  SLUG_MAX_LENGTH: 255,
} as const;

export const PRODUCT_TYPES = [
  { value: 'PHYSICAL', label: 'Physical Product' },
  { value: 'DIGITAL', label: 'Digital Product' },
  { value: 'COURSE', label: 'Course' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
] as const;

export const PRODUCT_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'price_asc', label: 'Price Low to High' },
  { value: 'price_desc', label: 'Price High to Low' },
  { value: 'purchases_desc', label: 'Best Selling' },
] as const;

export const PRODUCT_FILTER_OPTIONS = {
  TYPE: [
    { value: 'all', label: 'All Types' },
    { value: 'PHYSICAL', label: 'Physical Products' },
    { value: 'DIGITAL', label: 'Digital Products' },
    { value: 'COURSE', label: 'Courses' },
    { value: 'SUBSCRIPTION', label: 'Subscriptions' },
  ],
  STATUS: [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  PRICE_RANGES: [
    { value: 'all', label: 'All Prices', min: 0, max: Infinity },
    { value: 'under_25', label: 'Under $25', min: 0, max: 2500 },
    { value: '25_50', label: '$25 - $50', min: 2500, max: 5000 },
    { value: '50_100', label: '$50 - $100', min: 5000, max: 10000 },
    { value: '100_500', label: '$100 - $500', min: 10000, max: 50000 },
    { value: 'over_500', label: 'Over $500', min: 50000, max: Infinity },
  ],
} as const;

// Pricing tiers for courses
export const COURSE_PRICING = {
  BASIC: 99900, // $999.00
  ADVANCED: 199900, // $1999.00
  PREMIUM: 299900, // $2999.00
} as const;

// Subscription pricing
export const SUBSCRIPTION_PRICING = {
  MONTHLY: 2000, // $20.00/month
  YEARLY: 20000, // $200.00/year (2 months free)
} as const;

export const CURRENCY_CONFIG = {
  CURRENCY: 'USD',
  LOCALE: 'en-US',
  SYMBOL: '$',
} as const;