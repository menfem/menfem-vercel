// ABOUTME: Individual product page displaying detailed product information
// ABOUTME: Shows product details, pricing, purchase options, and related products

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProduct } from '@/features/products/queries/get-product';
import { getProducts } from '@/features/products/queries/get-products';
import { ProductDetails } from '@/features/products/components/product-details';
import { RelatedProducts } from '@/features/products/components/related-products';
import { ProductDetailsSkeleton } from '@/features/products/components/product-details-skeleton';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
  searchParams: { success?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | MenFem`,
    description: product.shortDesc || product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | MenFem`,
      description: product.shortDesc || product.description.substring(0, 160),
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProductDetails 
              product={product} 
              purchaseSuccess={searchParams.success === 'true'}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RelatedProductsSection 
                currentProductId={product.id}
                categoryId={product.categoryId}
                tags={product.tags.map(t => t.tag.slug)}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function RelatedProductsSection({
  currentProductId,
  categoryId,
  tags
}: {
  currentProductId: string;
  categoryId: string;
  tags: string[];
}) {
  const relatedProducts = await getProducts({
    limit: 4,
    isActive: true,
    categoryId,
    tags: tags.length > 0 ? tags : undefined,
  });

  // Filter out current product
  const filteredProducts = relatedProducts.list.filter(p => p.id !== currentProductId);

  return <RelatedProducts products={filteredProducts} />;
}

function RelatedProductsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-32"></div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-16 aspect-square bg-gray-200 rounded flex-shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}