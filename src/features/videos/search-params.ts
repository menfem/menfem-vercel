// ABOUTME: URL search parameters configuration for video pages
// ABOUTME: Defines type-safe URL state management for video filtering and pagination

import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
  parseAsArrayOf,
} from 'nuqs/server';
import { VIDEO_CONSTANTS } from './constants';

export const videoSearchParamsCache = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(VIDEO_CONSTANTS.DEFAULT_PAGE_SIZE),
  
  // Search and filtering
  search: parseAsString.withDefault(''),
  seriesId: parseAsString,
  isPremium: parseAsBoolean,
  isPublished: parseAsBoolean.withDefault(true),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  
  // Sorting
  sortBy: parseAsString.withDefault('createdAt'),
  sortOrder: parseAsString.withDefault('desc'),
});

export type VideoSearchParams = ReturnType<typeof videoSearchParamsCache.parse>;

// Admin-specific search params (includes drafts by default)
export const adminVideoSearchParamsCache = createSearchParamsCache({
  ...videoSearchParamsCache.parsers,
  isPublished: parseAsBoolean, // No default for admin (show all)
});

export type AdminVideoSearchParams = ReturnType<typeof adminVideoSearchParamsCache.parse>;

// Parser function for server components
export function parseVideoSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  return videoSearchParamsCache.parse(searchParams);
}