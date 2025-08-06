// ABOUTME: Related products sidebar component for product discovery
// ABOUTME: Shows list of related products based on category and tags

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '../utils/format-price';
import type { ProductListItem } from '../types';
import { BookOpen, Download, Package, Crown } from 'lucide-react';

interface RelatedProductsProps {
  products: ProductListItem[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
        <p className="text-gray-600 text-sm">No related products found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Related Products
      </h3>
      
      <div className="space-y-4">
        {products.map((product) => (
          <RelatedProductItem key={product.id} product={product} />
        ))}
      </div>

      {products.length >= 4 && (
        <div className="pt-4 border-t mt-4">
          <Link 
            href="/products" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all products →
          </Link>
        </div>
      )}
    </div>
  );
}

function RelatedProductItem({ product }: { product: ProductListItem }) {
  const getProductIcon = () => {
    switch (product.type) {
      case 'COURSE':
        return <BookOpen className="w-3 h-3" />;
      case 'DIGITAL':
        return <Download className="w-3 h-3" />;
      case 'PHYSICAL':
        return <Package className="w-3 h-3" />;
      case 'SUBSCRIPTION':
        return <Crown className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
    >
      {/* Product Image */}
      <div className="relative w-16 aspect-square bg-gray-100 rounded flex-shrink-0 overflow-hidden">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            {getProductIcon()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>
        
        <div className="text-sm font-semibold text-gray-900">
          {formatPrice(product.price)}
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            {getProductIcon()}
            <span>{product.type}</span>
          </div>
          <div>{product._count.purchases} sold</div>
        </div>
      </div>
    </Link>
  );
}