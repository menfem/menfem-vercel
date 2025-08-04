// ABOUTME: TypeScript type definitions for the products feature
// ABOUTME: Defines interfaces and types used across the products module

import type { 
  Product, 
  ProductCategory, 
  ProductTag, 
  Tag, 
  Purchase, 
  User,
  Course 
} from '@prisma/client';

export type ProductWithRelations = Product & {
  category: ProductCategory;
  tags: Array<ProductTag & {
    tag: Tag;
  }>;
  course?: Course | null;
  _count: {
    purchases: number;
  };
};

export type ProductListItem = ProductWithRelations;

export type PaginatedProducts = {
  list: ProductListItem[];
  metadata: {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type ProductCategoryWithProducts = ProductCategory & {
  products: ProductWithRelations[];
  _count: {
    products: number;
  };
};

export type UserPurchase = Purchase & {
  product: ProductWithRelations;
  user: Pick<User, 'id' | 'email' | 'username'>;
};

export type ProductFilters = {
  search?: string;
  categoryId?: string;
  type?: 'PHYSICAL' | 'DIGITAL' | 'COURSE' | 'SUBSCRIPTION';
  isActive?: boolean;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
};

export type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  images: string[];
  price: number;
  comparePrice?: number;
  isActive: boolean;
  isDigital: boolean;
  stock?: number;
  type: 'PHYSICAL' | 'DIGITAL' | 'COURSE' | 'SUBSCRIPTION';
  categoryId: string;
  tags: string[];
};

export type CheckoutSessionData = {
  productId: string;
  successUrl?: string;
  cancelUrl?: string;
};