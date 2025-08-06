// ABOUTME: Admin products list component with grid layout and actions
// ABOUTME: Displays products in a responsive grid with edit/delete functionality

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, ShoppingCart } from 'lucide-react';
import { AdminPagination } from '@/features/admin/components/admin-pagination';
import { AdminProductActions } from './admin-product-actions';
import { formatPrice } from '../../utils/format-price';
import type { ProductWithRelations, PaginatedProducts } from '../../types';

interface AdminProductsListProps {
  products: ProductWithRelations[];
  metadata: PaginatedProducts['metadata'];
}

export function AdminProductsList({ products, metadata }: AdminProductsListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground text-center mb-4">
            Get started by adding your first product to the catalog.
          </p>
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {metadata.totalPages > 1 && (
        <AdminPagination metadata={metadata} />
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductWithRelations }) {
  const hasImages = product.images && product.images.length > 0;
  const primaryImage = hasImages ? product.images[0] : null;
  const isLowStock = product.stock !== null && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        {/* Product Image */}
        <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Status Overlay */}
          <div className="absolute top-2 left-2 flex gap-1">
            {!product.isActive && (
              <Badge variant="secondary">Inactive</Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="outline">Low Stock</Badge>
            )}
            {product.isPremium && (
              <Badge variant="default">Premium</Badge>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline">
              {product.type.charAt(0) + product.type.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Category */}
          <p className="text-sm text-muted-foreground">
            {product.category.name}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {product.stock !== null && (
            <p className="text-sm text-muted-foreground">
              Stock: {product.stock} units
            </p>
          )}

          {/* Purchase Count */}
          <p className="text-sm text-muted-foreground">
            {product._count.purchases} sales
          </p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((productTag) => (
                <Badge key={productTag.tag.id} variant="outline" className="text-xs">
                  {productTag.tag.name}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {/* View Product */}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/products/${product.slug}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          
          <AdminProductActions product={product} />
        </div>
      </CardFooter>
    </Card>
  );
}