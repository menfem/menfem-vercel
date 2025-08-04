// ABOUTME: Query functions for user purchase history
// ABOUTME: Handles user-specific purchase tracking and access verification

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/queries/get-auth';

export const getUserPurchases = cache(async (userId?: string) => {
  // If no userId provided, try to get from auth
  if (!userId) {
    const auth = await getAuth();
    if (!auth.user) return [];
    userId = auth.user.id;
  }

  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    include: {
      product: {
        include: {
          category: true,
          course: true,
        },
      },
    },
    orderBy: {
      purchasedAt: 'desc',
    },
  });

  return purchases;
});

export const hasUserPurchased = cache(async (productId: string, userId?: string) => {
  // If no userId provided, try to get from auth
  if (!userId) {
    const auth = await getAuth();
    if (!auth.user) return false;
    userId = auth.user.id;
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      productId,
      status: 'COMPLETED',
    },
  });

  return !!purchase;
});

export const getUserAccessibleProducts = cache(async (userId?: string) => {
  // If no userId provided, try to get from auth
  if (!userId) {
    const auth = await getAuth();
    if (!auth.user) return [];
    userId = auth.user.id;
  }

  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    include: {
      product: {
        include: {
          category: true,
          course: true,
        },
      },
    },
    orderBy: {
      purchasedAt: 'desc',
    },
  });

  return purchases.map(purchase => purchase.product);
});

export const getUserCourseAccess = cache(async (courseId: string, userId?: string) => {
  // If no userId provided, try to get from auth
  if (!userId) {
    const auth = await getAuth();
    if (!auth.user) return false;
    userId = auth.user.id;
  }

  // Check if user has course enrollment
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (enrollment) return true;

  // Check if user has purchased the course product
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { product: true },
  });

  if (!course) return false;

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      productId: course.productId,
      status: 'COMPLETED',
    },
  });

  return !!purchase;
});