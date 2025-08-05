// ABOUTME: Admin page for creating new products
// ABOUTME: Provides form interface for adding products with categories and tags

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminProductForm } from '@/features/products/components/admin/admin-product-form';
import { getProductCategories } from '@/features/products/queries/get-product-categories';
import { getTags } from '@/features/admin/queries/get-tags';

export default async function NewProductPage() {
  // Fetch required data for the form
  const [categories, tags] = await Promise.all([
    getProductCategories(),
    getTags(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your catalog
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminProductForm 
            categories={categories}
            tags={tags}
          />
        </CardContent>
      </Card>
    </div>
  );
}