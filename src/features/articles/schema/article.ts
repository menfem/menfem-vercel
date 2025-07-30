// ABOUTME: Zod validation schemas for article operations
// ABOUTME: Ensures data integrity for article creation and updates

import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).optional(),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  categoryId: z.string().cuid(),
  tagIds: z.array(z.string().cuid()).optional(),
  coverImage: z.string().url().optional(),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;