// ABOUTME: Admin form component for creating and editing products
// ABOUTME: Comprehensive form with image upload, categories, tags, and pricing

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Plus } from 'lucide-react';
import { createProduct } from '../../actions/create-product';
import { updateProduct } from '../../actions/update-product';
import { PRODUCT_TYPES, COURSE_PRICING, SUBSCRIPTION_PRICING } from '../../constants';
import { formatPrice } from '../../utils/format-price';
import { toast } from 'sonner';
import type { ProductCategory, Tag } from '@prisma/client';
import type { ProductWithRelations } from '../../types';
import type { ActionState } from '@/types/action-state';

interface AdminProductFormProps {
  categories: ProductCategory[];
  tags: Tag[];
  product?: ProductWithRelations;
}

const initialState: ActionState = {
  status: undefined,
  message: undefined,
};

export function AdminProductForm({ categories, tags, product }: AdminProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(product);
  
  const [actionState, formAction] = useActionState(
    isEditing ? updateProduct : createProduct,
    initialState
  );

  // Form state
  const [selectedType, setSelectedType] = useState(product?.type || 'DIGITAL');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags.map(pt => pt.tag.id) || []
  );
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [imageInput, setImageInput] = useState('');

  // Handle form submission with toast feedback
  const handleSubmit = async (formData: FormData) => {
    // Add selected tags and images to form data
    selectedTags.forEach(tagId => formData.append('tags', tagId));
    images.forEach(image => formData.append('images', image));
    
    if (isEditing && product) {
      formData.append('id', product.id);
    }

    const result = await formAction(formData);
    
    if (result.status === 'SUCCESS') {
      toast.success(result.message);
      if (!isEditing) {
        router.push('/admin/products');
      }
    } else if (result.status === 'ERROR') {
      toast.error(result.message);
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getSuggestedPrice = (type: string) => {
    switch (type) {
      case 'COURSE':
        return COURSE_PRICING.BASIC;
      case 'SUBSCRIPTION':
        return SUBSCRIPTION_PRICING.MONTHLY;
      default:
        return 2000; // $20.00
    }
  };

  const isDigitalProduct = ['DIGITAL', 'COURSE', 'SUBSCRIPTION'].includes(selectedType);

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              placeholder="Enter product name"
              required
            />
            {actionState.fieldErrors?.name && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              placeholder="Detailed product description"
              rows={4}
              required
            />
            {actionState.fieldErrors?.description && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.description[0]}</p>
            )}
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDesc">Short Description (Optional)</Label>
            <Textarea
              id="shortDesc"
              name="shortDesc"
              defaultValue={product?.shortDesc || ''}
              placeholder="Brief description for product cards"
              rows={2}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" defaultValue={product?.categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {actionState.fieldErrors?.categoryId && (
              <p className="text-sm text-destructive">{actionState.fieldErrors.categoryId[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Type & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Type & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Product Type</Label>
            <Select 
              name="type" 
              value={selectedType}
              onValueChange={setSelectedType}
              defaultValue={product?.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (cents)
                <span className="text-sm text-muted-foreground ml-2">
                  Suggested: {formatPrice(getSuggestedPrice(selectedType))}
                </span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="100"
                defaultValue={product?.price}
                placeholder={getSuggestedPrice(selectedType).toString()}
                required
              />
              {actionState.fieldErrors?.price && (
                <p className="text-sm text-destructive">{actionState.fieldErrors.price[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare Price (cents)</Label>
              <Input
                id="comparePrice"
                name="comparePrice"
                type="number"
                min="100"
                defaultValue={product?.comparePrice || ''}
                placeholder="Original price for discounts"
              />
            </div>
          </div>

          {/* Stock (for physical products) */}
          {!isDigitalProduct && (
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock || ''}
                placeholder="Available inventory"
                required={!isDigitalProduct}
              />
            </div>
          )}

          {/* Hidden fields for digital products */}
          <input type="hidden" name="isDigital" value={isDigitalProduct.toString()} />
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Image URL */}
          <div className="flex gap-2">
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddImage} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Current Images */}
          {images.length > 0 && (
            <div className="space-y-2">
              <Label>Current Images</Label>
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Badge variant="outline" className="pr-6">
                      {image.length > 30 ? `${image.substring(0, 30)}...` : image}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagToggle(tag.id)}
                />
                <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                  {tag.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isActive" 
              name="isActive" 
              defaultChecked={product?.isActive !== false}
            />
            <Label htmlFor="isActive">
              Product is active and visible to customers
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={actionState.status === 'PENDING'}>
          {actionState.status === 'PENDING' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEditing ? 'Update Product' : 'Create Product'}
            </>
          )}
        </Button>
      </div>

      {/* Error Messages */}
      {actionState.status === 'ERROR' && actionState.message && (
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm text-destructive">{actionState.message}</p>
        </div>
      )}
    </form>
  );
}