// ABOUTME: Utility for generating unique slugs from product/category names
// ABOUTME: Handles slug generation with collision detection and numbering

import { prisma } from '@/lib/prisma';

/**
 * Generates a unique slug for products with database collision detection
 */
export async function generateSlug(name: string, table: 'product' | 'category' = 'product'): Promise<string> {
  // Create base slug from name
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Check if base slug is available
  const isAvailable = await checkSlugAvailability(baseSlug, table);
  if (isAvailable) {
    return baseSlug;
  }

  // Generate numbered variants until we find an available one
  let counter = 1;
  let candidateSlug = `${baseSlug}-${counter}`;

  while (!(await checkSlugAvailability(candidateSlug, table))) {
    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
    
    // Prevent infinite loops
    if (counter > 1000) {
      throw new Error('Unable to generate unique slug');
    }
  }

  return candidateSlug;
}

async function checkSlugAvailability(slug: string, table: 'product' | 'category'): Promise<boolean> {
  if (table === 'product') {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !existing;
  } else {
    const existing = await prisma.productCategory.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !existing;
  }
}

/**
 * Generates a category slug from name
 */
export async function generateCategorySlug(name: string): Promise<string> {
  return generateSlug(name, 'category');
}

/**
 * Generates a URL-friendly slug from a product name (legacy function)
 */
export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-');
}

/**
 * Validates if a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9-]+$/;
  return slugPattern.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
}

/**
 * Ensures slug uniqueness by appending a number if needed (legacy function)
 */
export function makeSlugUnique(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Truncates slug to maximum length while preserving word boundaries
 */
export function truncateSlug(slug: string, maxLength: number = 100): string {
  if (slug.length <= maxLength) return slug;
  
  // Find the last hyphen before the max length
  const truncated = slug.substring(0, maxLength);
  const lastHyphen = truncated.lastIndexOf('-');
  
  if (lastHyphen > 0) {
    return truncated.substring(0, lastHyphen);
  }
  
  return truncated;
}

/**
 * Cleans and formats slug input
 */
export function cleanSlugInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}