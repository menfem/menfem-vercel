// ABOUTME: TypeScript type definitions for articles feature
// ABOUTME: Defines interfaces and types used across the articles module

import type { Article, Category, Tag, User } from '@prisma/client';

export type ArticleWithRelations = Article & {
  author: Pick<User, 'id' | 'username' | 'email'>;
  category: Category;
  tags: Array<{
    tag: Tag;
  }>;
  _count: {
    comments: number;
    savedBy: number;
  };
};

export type ArticleListItem = ArticleWithRelations;

export type PaginatedArticles = {
  list: ArticleListItem[];
  metadata: {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};