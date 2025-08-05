// ABOUTME: Query to check if user has premium access to content
// ABOUTME: Returns premium subscription status and access permissions

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getAuth } from './get-auth';

export const getPremiumAccess = cache(async () => {
  const auth = await getAuth();

  if (!auth.user) {
    return { hasAccess: false, subscription: null };
  }

  const subscription = await prisma.membershipSubscription.findUnique({
    where: { userId: auth.user.id },
  });

  const hasAccess = subscription?.status === 'ACTIVE';

  return { hasAccess, subscription };
});