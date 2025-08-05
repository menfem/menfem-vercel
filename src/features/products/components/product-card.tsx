// ABOUTME: Product card component for displaying products in catalog view
// ABOUTME: Shows product image, details, pricing, and purchase buttons

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '../utils/format-price';
import { PurchaseButton } from './purchase-button';
import type { ProductListItem } from '../types';
import { cn } from '@/lib/utils';
import { ShoppingCart, BookOpen, Download, Package } from 'lucide-react';

interface ProductCardProps {
  product: ProductListItem;
  layout?: 'grid' | 'list';
  showDescription?: boolean;
}

export function ProductCard({ 
  product, 
  layout = 'grid',
  showDescription = true 
}: ProductCardProps) {
  const isGridLayout = layout === 'grid';
  const primaryImage = product.images[0];

  const getProductIcon = () => {
    switch (product.type) {
      case 'COURSE':
        return <BookOpen className="w-4 h-4" />;
      case 'DIGITAL':
        return <Download className="w-4 h-4" />;
      case 'PHYSICAL':
        return <Package className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getProductTypeLabel = () => {
    switch (product.type) {
      case 'COURSE':
        return 'Course';
      case 'DIGITAL':
        return 'Digital';
      case 'PHYSICAL':
        return 'Physical';
      case 'SUBSCRIPTION':
        return 'Subscription';
      default:
        return 'Product';
    }
  };

  return (
    <div className={cn(
      "group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
      isGridLayout ? "space-y-4" : "flex gap-6 p-6"
    )}>
      {/* Product Image */}
      <div className={cn(
        "relative bg-gray-100",
        isGridLayout ? "aspect-square" : "w-48 aspect-square flex-shrink-0"
      )}>
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              {getProductIcon()}
              <div className="text-xs mt-1">{getProductTypeLabel()}</div>
            </div>
          </div>
        )}
        
        {/* Product Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            {getProductIcon()}
            {getProductTypeLabel()}
          </Badge>
        </div>

        {/* Discount Badge */}
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="text-xs">
              Save {formatPrice(product.comparePrice - product.price)}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "space-y-3",
        isGridLayout ? "p-4" : "flex-1 min-w-0"
      )}>
        {/* Category */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {product.category.name}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {showDescription && product.shortDesc && (
          <p className={cn(
            "text-gray-600 text-sm",
            isGridLayout ? "line-clamp-2" : "line-clamp-3"
          )}>
            {product.shortDesc}
          </p>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          
          {product.type === 'SUBSCRIPTION' && (
            <div className="text-sm text-gray-600">per month</div>
          )}
        </div>

        {/* Course Info */}
        {product.course && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Level: {product.course.level}</span>
            <span>Duration: {product.course.duration}</span>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stock Info */}
        {product.type === 'PHYSICAL' && product.stock !== null && (
          <div className="text-sm text-gray-600">
            {product.stock > 0 ? (
              <span className="text-green-600">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>
        )}

        {/* Purchase Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{product._count.purchases} sold</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <PurchaseButton product={product} className="w-full" />
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}