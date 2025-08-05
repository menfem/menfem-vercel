// ABOUTME: Search parameters configuration for product catalog filtering
// ABOUTME: Defines URL state management for product search and filters

import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  categoryId: parseAsString.withDefault(''),
  type: parseAsString.withDefault(''),
  minPrice: parseAsInteger.withDefault(0),
  maxPrice: parseAsInteger.withDefault(0),
});