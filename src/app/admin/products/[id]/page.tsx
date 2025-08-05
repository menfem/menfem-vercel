// ABOUTME: Admin product detail page with overview and analytics
// ABOUTME: Shows product information, sales stats, and management actions

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, Eye, Package, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminProductActions } from '@/features/products/components/admin/admin-product-actions';
import { getProduct } from '@/features/products/queries/get-product';
import { formatPrice } from '@/features/products/utils/format-price';
import { format } from 'date-fns';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const hasImages = product.images && product.images.length > 0;
  const primaryImage = hasImages ? product.images[0] : null;
  const isLowStock = product.stock !== null && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

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
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              {product.category.name} • Created {format(new Date(product.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.slug}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Live
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Status & Quick Info */}
      <div className="flex items-center gap-2 flex-wrap">
        {!product.isActive && (
          <Badge variant="secondary">Inactive</Badge>
        )}
        {isOutOfStock && (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
        {isLowStock && !isOutOfStock && (
          <Badge variant="outline">Low Stock</Badge>
        )}
        <Badge variant="outline">
          {product.type.charAt(0) + product.type.slice(1).toLowerCase()}
        </Badge>
        {product.tags.map((productTag) => (
          <Badge key={productTag.tag.id} variant="outline">
            {productTag.tag.name}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          {hasImages && (
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {product.shortDesc && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm text-muted-foreground mb-1">Short Description:</p>
                    <p>{product.shortDesc}</p>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{product.description}</div>
              </div>
            </CardContent>
          </Card>

          {/* Course Information */}
          {product.course && (
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Level</h4>
                  <Badge variant="outline">
                    {product.course.level.charAt(0) + product.course.level.slice(1).toLowerCase()}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Duration</h4>
                  <p className="text-sm text-muted-foreground">{product.course.duration}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Syllabus</h4>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {product.course.syllabus}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Product Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Sales</span>
                </div>
                <span className="font-semibold">{product._count.purchases}</span>
              </div>

              {product.stock !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Stock</span>
                  </div>
                  <span className="font-semibold">{product.stock}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(product.createdAt), 'MMM d, yyyy')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Updated</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(product.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Price in cents: {product.price}
                </p>
              </div>

              {product.comparePrice && product.comparePrice > product.price && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Save {formatPrice(product.comparePrice - product.price)}
                  </p>
                  <p className="text-xs text-green-600">
                    {Math.round((1 - product.price / product.comparePrice) * 100)}% off
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <Badge variant="outline">{product.category.name}</Badge>
              </div>

              {product.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((productTag) => (
                      <Badge key={productTag.tag.id} variant="outline" className="text-xs">
                        {productTag.tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Link>
              </Button>
              
              <div className="flex justify-center">
                <AdminProductActions product={product} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}