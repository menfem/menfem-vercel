// ABOUTME: Admin products filters component for search and filtering
// ABOUTME: Provides search, category, type, and status filtering with URL state management

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { PRODUCT_FILTER_OPTIONS, PRODUCT_TYPES } from '../../constants';
import type { ProductCategory } from '@prisma/client';
import type { ProductFiltersInput } from '../../schema/product';

interface AdminProductsFiltersProps {
  categories: ProductCategory[];
  currentFilters: ProductFiltersInput;
}

export function AdminProductsFilters({ categories, currentFilters }: AdminProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounced search handler
  const handleSearch = useDebouncedCallback((value: string) => {
    updateFilters({ search: value || undefined });
  }, 300);

  const updateFilters = (newFilters: Partial<ProductFiltersInput>) => {
    const params = new URLSearchParams(searchParams);
    
    // Update or remove filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to first page when filters change
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      params.delete('page');
    }

    router.push(`/admin/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/admin/products');
  };

  const hasActiveFilters = Boolean(
    currentFilters.search ||
    currentFilters.categoryId ||
    (currentFilters.type && currentFilters.type !== 'all') ||
    (currentFilters.isActive !== undefined)
  );

  return (
    <div className="space-y-4">
      {/* Search and Clear */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            defaultValue={currentFilters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Category Filter */}
        <Select
          value={currentFilters.categoryId || 'all'}
          onValueChange={(value) => updateFilters({ categoryId: value === 'all' ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={currentFilters.type || 'all'}
          onValueChange={(value) => updateFilters({ type: value === 'all' ? undefined : value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PRODUCT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={
            currentFilters.isActive === undefined 
              ? 'all' 
              : currentFilters.isActive 
                ? 'active' 
                : 'inactive'
          }
          onValueChange={(value) => 
            updateFilters({ 
              isActive: value === 'all' ? undefined : value === 'active' 
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_FILTER_OPTIONS.STATUS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select
          value={`${currentFilters.sortBy}_${currentFilters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('_');
            updateFilters({ 
              sortBy: sortBy as any,
              sortOrder: sortOrder as 'asc' | 'desc'
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Newest First</SelectItem>
            <SelectItem value="createdAt_asc">Oldest First</SelectItem>
            <SelectItem value="name_asc">Name A-Z</SelectItem>
            <SelectItem value="name_desc">Name Z-A</SelectItem>
            <SelectItem value="price_asc">Price Low to High</SelectItem>
            <SelectItem value="price_desc">Price High to Low</SelectItem>
            <SelectItem value="purchases_desc">Best Selling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing filtered results
          {currentFilters.search && ` for "${currentFilters.search}"`}
        </div>
      )}
    </div>
  );
}