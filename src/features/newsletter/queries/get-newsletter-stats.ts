// ABOUTME: Query function for fetching newsletter subscription statistics
// ABOUTME: Provides counts and metrics for newsletter management

import { prisma } from '@/lib/prisma';

export async function getNewsletterStats() {
  const [totalSubscribers, activeSubscribers, unsubscribed, pendingConfirmation] = await Promise.all([
    prisma.newsletterSubscription.count(),
    prisma.newsletterSubscription.count({
      where: { isActive: true },
    }),
    prisma.newsletterSubscription.count({
      where: { isActive: false, unsubscribedAt: { not: null } },
    }),
    prisma.newsletterSubscription.count({
      where: { isActive: false, confirmationToken: { not: null } },
    }),
  ]);

  return {
    totalSubscribers,
    activeSubscribers,
    unsubscribed,
    pendingConfirmation,
    conversionRate: totalSubscribers > 0 ? (activeSubscribers / totalSubscribers) * 100 : 0,
  };
}