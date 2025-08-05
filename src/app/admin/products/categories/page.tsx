// ABOUTME: Admin page for managing product categories
// ABOUTME: CRUD interface for creating, editing, and organizing product categories

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { AdminProductCategoriesList } from '@/features/products/components/admin/admin-product-categories-list';
import { getProductCategories } from '@/features/products/queries/get-product-categories';

export default async function ProductCategoriesPage() {
  const categories = await getProductCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">Product Categories</h1>
            <p className="text-muted-foreground">
              Organize your products into categories
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href="/admin/products/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading categories...</div>}>
            <AdminProductCategoriesList categories={categories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}