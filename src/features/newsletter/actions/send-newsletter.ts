'use server';

// ABOUTME: Server action for manually sending weekly newsletter
// ABOUTME: Admin-only functionality to trigger newsletter generation and sending

import { NewsletterGenerator } from '../services/newsletter-generator';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '@/components/form/utils/to-action-state';

export async function sendWeeklyNewsletter(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // TODO: Add admin check when admin system is implemented
    const { user } = await getAuthOrRedirect();
    
    // For now, allow any authenticated user (change this when admin system is ready)
    if (!user.emailVerified) {
      return toActionState('ERROR', 'Email verification required');
    }

    const generator = new NewsletterGenerator();
    const result = await generator.sendWeeklyNewsletter();

    return toActionState(
      'SUCCESS',
      `Newsletter sent successfully! ${result.sent} emails sent, ${result.failed} failed.`
    );
  } catch (error) {
    console.error('Newsletter sending failed:', error);
    return fromErrorToActionState(error, formData);
  }
}

export async function previewNewsletter(): Promise<{
  success: boolean;
  data?: {
    featuredArticle: {
      id: string;
      title: string;
      excerpt: string;
      slug: string;
    };
    recentArticles: Array<{
      id: string;
      title: string;
      excerpt: string;
      slug: string;
    }>;
    weekOf: string;
  };
  error?: string;
}> {
  try {
    const { user } = await getAuthOrRedirect();
    
    if (!user.emailVerified) {
      throw new Error('Email verification required');
    }

    const generator = new NewsletterGenerator();
    return await generator.previewNewsletter();
  } catch (error) {
    console.error('Newsletter preview failed:', error);
    throw error;
  }
}