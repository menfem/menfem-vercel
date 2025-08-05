// ABOUTME: Product filtering component for search and filter controls
// ABOUTME: Provides search input, category filter, type filter, and price range

'use client';

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import { formatPrice } from '../utils/format-price';
import type { ProductCategory } from '../types';

interface ProductFiltersProps {
  categories: ProductCategory[];
  searchParams: any;
}

export function ProductFilters({ categories, searchParams }: ProductFiltersProps) {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [categoryId, setCategoryId] = useQueryState('categoryId', parseAsString.withDefault(''));
  const [type, setType] = useQueryState('type', parseAsString.withDefault(''));
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger.withDefault(0));

  const hasActiveFilters = search || categoryId || type || minPrice > 0 || maxPrice > 0;

  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setType('');
    setMinPrice(0);
    setMaxPrice(0);
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filter Products</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Product Type Filter */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="COURSE">Courses</SelectItem>
            <SelectItem value="DIGITAL">Digital Products</SelectItem>
            <SelectItem value="PHYSICAL">Physical Products</SelectItem>
            <SelectItem value="SUBSCRIPTION">Subscriptions</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min $"
            value={minPrice || ''}
            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max $"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{search}"
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {categoryId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.id === categoryId)?.name}
              <button onClick={() => setCategoryId('')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {type}
              <button onClick={() => setType('')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {(minPrice > 0 || maxPrice > 0) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: {minPrice > 0 && formatPrice(minPrice * 100)} - {maxPrice > 0 && formatPrice(maxPrice * 100)}
              <button onClick={() => { setMinPrice(0); setMaxPrice(0); }}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}