// ABOUTME: Zod validation schemas for product data
// ABOUTME: Handles form validation and data sanitization for product operations

import { z } from 'zod';
import { PRODUCT_CONSTANTS } from '../constants';

// Product creation schema
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name must be at least 3 characters long')
    .max(255, 'Product name must be less than 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(10000, 'Description must be less than 10,000 characters'),
  shortDesc: z
    .string()
    .max(500, 'Short description must be less than 500 characters')
    .optional(),
  images: z
    .array(z.string().url('Invalid image URL'))
    .max(PRODUCT_CONSTANTS.MAX_IMAGES, `Maximum ${PRODUCT_CONSTANTS.MAX_IMAGES} images allowed`)
    .default([]),
  price: z
    .number()
    .int('Price must be a whole number')
    .min(PRODUCT_CONSTANTS.MIN_PRICE, `Price must be at least $${PRODUCT_CONSTANTS.MIN_PRICE / 100}`)
    .max(PRODUCT_CONSTANTS.MAX_PRICE, `Price cannot exceed $${PRODUCT_CONSTANTS.MAX_PRICE / 100}`),
  comparePrice: z
    .number()
    .int('Compare price must be a whole number')
    .min(PRODUCT_CONSTANTS.MIN_PRICE)
    .max(PRODUCT_CONSTANTS.MAX_PRICE)
    .optional(),
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .optional(),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'COURSE', 'SUBSCRIPTION']),
  categoryId: z.string().cuid('Invalid category ID'),
  tags: z.array(z.string().cuid()).default([]),
}).refine(
  (data) => !data.comparePrice || data.comparePrice > data.price,
  {
    message: 'Compare price must be higher than the regular price',
    path: ['comparePrice'],
  }
).refine(
  (data) => data.isDigital || typeof data.stock === 'number',
  {
    message: 'Stock quantity is required for physical products',
    path: ['stock'],
  }
);

// Product update schema (allows partial updates)
export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().cuid(),
});

// Product category schema
export const createProductCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(100, 'Category name must be less than 100 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

export const updateProductCategorySchema = createProductCategorySchema.partial().extend({
  id: z.string().cuid(),
});

// Product search and filter schema
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'COURSE', 'SUBSCRIPTION']).optional(),
  isActive: z.boolean().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(PRODUCT_CONSTANTS.MAX_PAGE_SIZE).default(PRODUCT_CONSTANTS.DEFAULT_PAGE_SIZE),
  sortBy: z.enum(['createdAt', 'name', 'price', 'purchases']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Checkout session schema
export const createCheckoutSessionSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// Purchase tracking schema
export const createPurchaseSchema = z.object({
  userId: z.string().cuid(),
  productId: z.string().cuid(),
  stripePaymentId: z.string(),
  amount: z.number().int().min(0),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).default('PENDING'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;