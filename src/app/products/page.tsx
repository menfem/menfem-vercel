// ABOUTME: E-commerce product catalog page displaying courses and digital products
// ABOUTME: Features product filtering, search, and purchase functionality

import { Suspense } from 'react';
import { getProducts } from '@/features/products/queries/get-products';
import { getProductCategories } from '@/features/products/queries/get-product-categories';
import { ProductCatalog } from '@/features/products/components/product-catalog';
import { ProductCatalogSkeleton } from '@/features/products/components/product-catalog-skeleton';
import { searchParamsCache } from '@/features/products/search-params';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products & Courses | MenFem',
  description: 'Discover premium courses, digital products, and resources for personal development, masculinity, and success.',
  openGraph: {
    title: 'Products & Courses | MenFem',
    description: 'Discover premium courses, digital products, and resources for personal development, masculinity, and success.',
  },
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = searchParamsCache.parse(resolvedSearchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Products & Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Invest in your personal development with our comprehensive courses, 
            workshops, and digital resources designed for the modern man.
          </p>
        </div>

        <Suspense fallback={<ProductCatalogSkeleton />}>
          <ProductCatalogContent searchParams={parsedParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductCatalogContent({ 
  searchParams 
}: { 
  searchParams: Record<string, string | string[] | undefined>
}) {
  const [productsData, categories] = await Promise.all([
    getProducts({
      page: searchParams.page,
      search: searchParams.search,
      categoryId: searchParams.categoryId,
      type: searchParams.type,
      isActive: true, // Only show active products to public
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
    }),
    getProductCategories(),
  ]);

  return (
    <ProductCatalog 
      products={productsData.list}
      metadata={productsData.metadata}
      categories={categories}
      searchParams={searchParams}
    />
  );
}