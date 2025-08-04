// ABOUTME: Server action for deleting articles (admin only)
// ABOUTME: Handles article deletion with proper cascade cleanup

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminOrRedirect } from '../queries/get-admin-or-redirect';
import type { ActionState } from '@/types/action-state';

const deleteArticleSchema = z.object({
  id: z.string().min(1, 'Article ID is required'),
});

export async function deleteArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await getAdminOrRedirect();

    const { id } = deleteArticleSchema.parse({
      id: formData.get('id'),
    });

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true }
    });

    if (!article) {
      return {
        status: 'error',
        message: 'Article not found',
      };
    }

    // Delete article (cascades will handle related data)
    await prisma.article.delete({
      where: { id },
    });

    revalidatePath('/admin/articles');
    revalidatePath('/articles');

    // Redirect to admin articles list
    redirect('/admin/articles?deleted=true');

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        message: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    console.error('Error deleting article:', error);
    return {
      status: 'error',
      message: 'Failed to delete article',
    };
  }
}

export async function toggleArticleStatus(
  articleId: string,
  isPublished: boolean
): Promise<ActionState> {
  try {
    await getAdminOrRedirect();

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, isPublished: true, publishedAt: true }
    });

    if (!article) {
      return {
        status: 'error',
        message: 'Article not found',
      };
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        isPublished,
        publishedAt: isPublished && !article.publishedAt ? new Date() : article.publishedAt,
      },
    });

    revalidatePath('/admin/articles');
    revalidatePath('/articles');

    return {
      status: 'success',
      message: `Article ${isPublished ? 'published' : 'unpublished'} successfully`,
    };

  } catch (error) {
    console.error('Error toggling article status:', error);
    return {
      status: 'error',
      message: 'Failed to update article status',
    };
  }
}