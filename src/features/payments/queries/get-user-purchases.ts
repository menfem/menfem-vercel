// ABOUTME: Query functions for fetching user purchase history
// ABOUTME: Retrieves purchase data and subscription information

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { UserPurchase } from '@/features/products/types';

export const getUserPurchases = cache(async (userId: string): Promise<UserPurchase[]> => {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          course: true,
          _count: {
            select: {
              purchases: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
    orderBy: { purchasedAt: 'desc' },
  });

  return purchases as UserPurchase[];
});

export const getCompletedPurchases = cache(async (userId: string): Promise<UserPurchase[]> => {
  const purchases = await prisma.purchase.findMany({
    where: { 
      userId,
      status: 'COMPLETED',
    },
    include: {
      product: {
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          course: true,
          _count: {
            select: {
              purchases: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
    orderBy: { purchasedAt: 'desc' },
  });

  return purchases as UserPurchase[];
});

export const getUserSubscription = cache(async (userId: string) => {
  const subscription = await prisma.membershipSubscription.findUnique({
    where: { userId },
  });

  return subscription;
});

export const hasActiveSubscription = cache(async (userId: string): Promise<boolean> => {
  const subscription = await prisma.membershipSubscription.findUnique({
    where: { userId },
  });

  return subscription?.status === 'ACTIVE';
});

export const hasPurchasedProduct = cache(async (userId: string, productId: string): Promise<boolean> => {
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      productId,
      status: 'COMPLETED',
    },
  });

  return !!purchase;
});

export const getUserCourseAccess = cache(async (userId: string) => {
  // Get completed course purchases
  const coursePurchases = await prisma.purchase.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      product: {
        type: 'COURSE',
      },
    },
    include: {
      product: {
        include: {
          course: true,
        },
      },
    },
  });

  return coursePurchases.filter(p => p.product.course).map(p => p.product.course!);
});

export const getPurchaseHistory = cache(async (userId: string, limit: number = 10) => {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          type: true,
          images: true,
        },
      },
    },
    orderBy: { purchasedAt: 'desc' },
    take: limit,
  });

  return purchases;
});