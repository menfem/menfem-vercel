// ABOUTME: Server action for updating existing articles (admin only)
// ABOUTME: Handles article updates with validation and admin authorization

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '../queries/get-admin-or-redirect';
import { generateSlug } from '@/utils/generate-slug';
import type { ActionState } from '@/types/action-state';

const updateArticleSchema = z.object({
  id: z.string().min(1, 'Article ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subtitle: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  readingTime: z.coerce.number().min(1).max(60),
  isPremium: z.boolean(),
  isPublished: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function updateArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await getAdminOrRedirect();

    const data = updateArticleSchema.parse({
      id: formData.get('id'),
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

    // Get existing article
    const existingArticle = await prisma.article.findUnique({
      where: { id: data.id },
      include: { tags: true }
    });

    if (!existingArticle) {
      return {
        status: 'error',
        message: 'Article not found',
      };
    }

    // Generate new slug if title changed
    let slug = existingArticle.slug;
    if (data.title !== existingArticle.title) {
      const baseSlug = generateSlug(data.title);
      slug = baseSlug;
      let counter = 1;
      
      while (await prisma.article.findFirst({ 
        where: { slug, id: { not: data.id } } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Update article
    const wasPublished = existingArticle.isPublished;
    const isNowPublished = data.isPublished;
    
    await prisma.article.update({
      where: { id: data.id },
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
        publishedAt: !wasPublished && isNowPublished ? new Date() : existingArticle.publishedAt,
      },
    });

    // Handle tags update
    if (data.tags !== undefined) {
      // Remove existing tags
      await prisma.articleTag.deleteMany({
        where: { articleId: data.id }
      });

      // Add new tags if provided
      const tagNames = data.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      if (tagNames.length > 0) {
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

        await prisma.articleTag.createMany({
          data: tags.map(tag => ({
            articleId: data.id,
            tagId: tag.id,
          })),
        });
      }
    }

    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${data.id}`);
    revalidatePath('/articles');
    revalidatePath(`/articles/${slug}`);

    return {
      status: 'success',
      message: 'Article updated successfully',
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        message: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    console.error('Error updating article:', error);
    return {
      status: 'error',
      message: 'Failed to update article',
    };
  }
}