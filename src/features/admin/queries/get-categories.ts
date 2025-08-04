// ABOUTME: Query to get all categories for admin forms
// ABOUTME: Provides category options for article creation and editing

import { prisma } from '@/lib/prisma';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    }
  });
}