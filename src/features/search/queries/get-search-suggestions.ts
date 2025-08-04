// ABOUTME: Search suggestions query for autocomplete functionality
// ABOUTME: Provides relevant suggestions based on articles, tags, and categories

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type SearchSuggestion = {
  id: string;
  text: string;
  type: 'article' | 'tag' | 'category';
  count?: number;
};

export const getSearchSuggestions = cache(async (query: string): Promise<SearchSuggestion[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  try {
    // Get matching articles (titles)
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        title: {
          contains: normalizedQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
      },
      take: 5,
    });

    // Get matching tags
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: normalizedQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      take: 5,
    });

    // Get matching categories
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: normalizedQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      take: 3,
    });

    const suggestions: SearchSuggestion[] = [
      // Add article suggestions
      ...articles.map(article => ({
        id: article.id,
        text: article.title,
        type: 'article' as const,
      })),
      // Add tag suggestions
      ...tags.map(tag => ({
        id: tag.id,
        text: tag.name,
        type: 'tag' as const,
        count: tag._count.articles,
      })),
      // Add category suggestions
      ...categories.map(category => ({
        id: category.id,
        text: category.name,
        type: 'category' as const,
        count: category._count.articles,
      })),
    ];

    // Sort by relevance (exact matches first, then by count/length)
    return suggestions
      .sort((a, b) => {
        // Exact matches first
        const aExact = a.text.toLowerCase() === normalizedQuery;
        const bExact = b.text.toLowerCase() === normalizedQuery;
        if (aExact && !bExact) return -1;
        if (bExact && !aExact) return 1;

        // Then by count (if available)
        if (a.count && b.count) {
          return b.count - a.count;
        }

        // Finally by text length (shorter is better)
        return a.text.length - b.text.length;
      })
      .slice(0, 8); // Limit to 8 suggestions
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
});