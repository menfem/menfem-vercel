// ABOUTME: URL search parameter parsing and type safety for articles
// ABOUTME: Provides server-side parameter validation with default values

import { createSearchParamsCache, parseAsString, parseAsInteger } from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(12),
  search: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  tags: parseAsString.withDefault(''),
  sortBy: parseAsString.withDefault('publishedAt'),
  sortOrder: parseAsString.withDefault('desc'),
});

export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;