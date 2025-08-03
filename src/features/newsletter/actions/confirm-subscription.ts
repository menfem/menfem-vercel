'use server';

// ABOUTME: Server action for confirming newsletter subscription
// ABOUTME: Validates confirmation token and activates subscription

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PATHS } from '@/paths';

export async function confirmNewsletterSubscription(token: string) {
  if (!token) {
    redirect(PATHS.HOME + '?newsletter=invalid');
  }

  const subscription = await prisma.newsletterSubscription.findUnique({
    where: { confirmationToken: token },
  });

  if (!subscription) {
    redirect(PATHS.HOME + '?newsletter=invalid');
  }

  if (subscription.isActive) {
    redirect(PATHS.HOME + '?newsletter=already-confirmed');
  }

  // Activate subscription and clear token
  await prisma.newsletterSubscription.update({
    where: { id: subscription.id },
    data: {
      isActive: true,
      confirmationToken: null,
    },
  });

  redirect(PATHS.HOME + '?newsletter=confirmed');
}