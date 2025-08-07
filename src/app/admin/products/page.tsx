// ABOUTME: Admin products management page with filtering and CRUD operations
// ABOUTME: Provides interface for managing product catalog, categories, and inventory

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { AdminProductsList } from '@/features/products/components/admin/admin-products-list';
import { AdminProductsFilters } from '@/features/products/components/admin/admin-products-filters';
import { getProducts } from '@/features/products/queries/get-products';
import { getProductCategories } from '@/features/products/queries/get-product-categories';
import { productFiltersSchema } from '@/features/products/schema/product';
import type { SearchParams } from '@/types/search-params';

interface AdminProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  
  // Parse and validate search parameters
  const parsedParams = productFiltersSchema.parse({
    ...resolvedSearchParams,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1,
    limit: resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit as string) : 12,
    isActive: resolvedSearchParams.isActive === 'false' ? false : undefined,
  });

  // Fetch data in parallel
  const [productsData, categories] = await Promise.all([
    getProducts(parsedParams),
    getProductCategories(),
  ]);

  // Calculate summary stats 
  const totalProducts = productsData.metadata.count;
  const activeProducts = await getProducts({ isActive: true }).then(data => data.metadata.count);
  const inactiveProducts = totalProducts - activeProducts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/categories">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} active, {inactiveProducts} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              Total sales (coming soon)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <AdminProductsFilters 
              categories={categories}
              currentFilters={parsedParams}
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Products List */}
      <Suspense fallback={<div>Loading products...</div>}>
        <AdminProductsList 
          products={productsData.list}
          metadata={productsData.metadata}
        />
      </Suspense>
    </div>
  );
}