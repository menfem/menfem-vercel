// ABOUTME: Detailed product view component with images, description, and purchase options
// ABOUTME: Shows comprehensive product information and handles purchase success states

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PurchaseButton } from './purchase-button';
import { formatPrice } from '../utils/format-price';
import type { ProductWithRelations } from '../types';
import { 
  BookOpen, 
  Download, 
  Package, 
  Crown, 
  CheckCircle,
  Calendar,
  Users,
  Tag,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: ProductWithRelations;
  purchaseSuccess?: boolean;
}

export function ProductDetails({ product, purchaseSuccess }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (purchaseSuccess) {
      setShowSuccessMessage(true);
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [purchaseSuccess]);

  const getProductIcon = () => {
    switch (product.type) {
      case 'COURSE':
        return <BookOpen className="w-5 h-5" />;
      case 'DIGITAL':
        return <Download className="w-5 h-5" />;
      case 'PHYSICAL':
        return <Package className="w-5 h-5" />;
      case 'SUBSCRIPTION':
        return <Crown className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getProductTypeLabel = () => {
    switch (product.type) {
      case 'COURSE':
        return 'Online Course';
      case 'DIGITAL':
        return 'Digital Product';
      case 'PHYSICAL':
        return 'Physical Product';
      case 'SUBSCRIPTION':
        return 'Subscription';
      default:
        return 'Product';
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">Purchase Successful!</h3>
            <p className="text-sm text-green-700">
              Thank you for your purchase. You&apos;ll receive confirmation details via email.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto"
          >
            ×
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  {getProductIcon()}
                  <div className="text-sm mt-2">{getProductTypeLabel()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2",
                    selectedImageIndex === index 
                      ? "border-blue-500" 
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {getProductIcon()}
                {getProductTypeLabel()}
              </Badge>
              <Badge variant="outline">{product.category.name}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {product.shortDesc && (
              <p className="text-xl text-gray-600">{product.shortDesc}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            
            {product.type === 'SUBSCRIPTION' && (
              <div className="text-gray-600">per month</div>
            )}

            {product.comparePrice && product.comparePrice > product.price && (
              <div className="text-green-600 font-medium">
                Save {formatPrice(product.comparePrice - product.price)} 
                ({Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off)
              </div>
            )}
          </div>

          {/* Course Info */}
          {product.course && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Level:</span>
                  <div className="text-blue-900">{product.course.level}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Duration:</span>
                  <div className="text-blue-900">{product.course.duration}</div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Info */}
          {product.type === 'PHYSICAL' && product.stock !== null && (
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">
                    In stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Out of stock</span>
                </>
              )}
            </div>
          )}

          {/* Purchase Actions */}
          <div className="space-y-3">
            <PurchaseButton product={product} size="lg" className="w-full" />
            
            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{product._count.purchases} sold</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Added {new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure payment via Stripe</span>
            </div>
            {product.type === 'DIGITAL' && (
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Instant download after purchase</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Description</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">Tags</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}