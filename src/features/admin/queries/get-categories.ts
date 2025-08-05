// ABOUTME: Query to get all categories and tags for admin forms
// ABOUTME: Provides category and tag options for content creation and editing

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

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    }
  });
}