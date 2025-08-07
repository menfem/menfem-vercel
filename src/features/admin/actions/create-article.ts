// ABOUTME: Server action for creating new articles (admin only)
// ABOUTME: Handles article creation with validation and admin authorization

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '../queries/get-admin-or-redirect';
import { generateSlug } from '@/utils/generate-slug';
import type { ActionState } from '@/types/action-state';

const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subtitle: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(), // Comma-separated tag names
  readingTime: z.coerce.number().min(1).max(60).default(5),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function createArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const { user } = await getAdminOrRedirect();

    const data = createArticleSchema.parse({
      title: formData.get('title'),
      subtitle: formData.get('subtitle') || undefined,
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      coverImage: formData.get('coverImage') || undefined,
      categoryId: formData.get('categoryId'),
      tags: formData.get('tags') || undefined,
      readingTime: formData.get('readingTime'),
      isPremium: formData.get('isPremium') === 'on',
      isPublished: formData.get('isPublished') === 'on',
      metaTitle: formData.get('metaTitle') || undefined,
      metaDescription: formData.get('metaDescription') || undefined,
    });

    // Generate unique slug
    const baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        readingTime: data.readingTime,
        isPremium: data.isPremium,
        isPublished: data.isPublished,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug,
        authorId: user.id,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    // Handle tags if provided
    if (data.tags) {
      const tagNames = data.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      if (tagNames.length > 0) {
        // Create or find tags
        const tags = await Promise.all(
          tagNames.map(async (name) => {
            const slug = generateSlug(name);
            return prisma.tag.upsert({
              where: { slug },
              update: {},
              create: { name, slug },
            });
          })
        );

        // Connect tags to article
        await prisma.articleTag.createMany({
          data: tags.map(tag => ({
            articleId: article.id,
            tagId: tag.id,
          })),
        });
      }
    }

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    redirect(`/admin/articles/${article.id}`);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 'ERROR',
        message: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    console.error('Error creating article:', error);
    return {
      status: 'ERROR',
      message: 'Failed to create article',
    };
  }
}