// ABOUTME: Main product catalog component with filtering and display
// ABOUTME: Handles product grid layout, filtering, and pagination for public viewing

'use client';

import { useState } from 'react';
import { ProductCard } from './product-card';
import { ProductFilters } from './product-filters';
import { Pagination } from '@/components/ui/pagination';
import type { ProductWithRelations, ProductCategory } from '../types';

interface ProductCatalogProps {
  products: ProductWithRelations[];
  metadata: {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  categories: ProductCategory[];
}

export function ProductCatalog({ 
  products, 
  metadata, 
  categories
}: ProductCatalogProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <ProductFilters categories={categories} />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProductFilters categories={categories} />

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {metadata.count} products
        </p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            layout={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {metadata.totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={metadata.page}
            totalPages={metadata.totalPages}
            hasNextPage={metadata.hasNextPage}
            hasPreviousPage={metadata.hasPreviousPage}
          />
        </div>
      )}
    </div>
  );
}

function GridIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}