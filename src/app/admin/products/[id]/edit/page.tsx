// ABOUTME: Admin page for editing existing products
// ABOUTME: Edit form with pre-populated data for product management

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminProductForm } from '@/features/products/components/admin/admin-product-form';
import { getProduct } from '@/features/products/queries/get-product';
import { getProductCategories } from '@/features/products/queries/get-product-categories';
import { getTags } from '@/features/admin/queries/get-categories';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Fetch data in parallel
  const [product, categories, tags] = await Promise.all([
    getProduct(params.id),
    getProductCategories(),
    getTags(),
  ]);

  if (!product) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Update {product.name}
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
            product={product}
            categories={categories}
            tags={tags}
          />
        </CardContent>
      </Card>
    </div>
  );
}