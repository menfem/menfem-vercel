// ABOUTME: Admin component for listing and managing product categories
// ABOUTME: Displays categories with edit/delete actions and product counts

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Loader2, Package } from 'lucide-react';
import { deleteProductCategory } from '../../actions/delete-product-category';
import { toast } from 'sonner';
import type { ProductCategoryWithProducts } from '../../types';

interface AdminProductCategoriesListProps {
  categories: ProductCategoryWithProducts[];
}

export function AdminProductCategoriesList({ categories }: AdminProductCategoriesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (categoryId: string) => {
    setDeletingId(categoryId);
    
    try {
      const formData = new FormData();
      formData.append('categoryId', categoryId);
      
      const result = await deleteProductCategory(
        { status: undefined, message: undefined },
        formData
      );

      if (result.status === 'SUCCESS') {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No categories found</h3>
        <p className="text-muted-foreground text-center mb-4">
          Create your first product category to organize your catalog.
        </p>
        <Button asChild>
          <Link href="/admin/products/categories/new">Add Category</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                {category.name}
              </TableCell>
              <TableCell>
                <div className="max-w-md">
                  {category.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  ) : (
                    <span className="text-muted-foreground italic">No description</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {category._count.products} products
                </Badge>
              </TableCell>
              <TableCell>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/products/categories/${category.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingId === category.id}
                      >
                        {deletingId === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Are you sure you want to delete the category &quot;<strong>{category.name}</strong>&quot;?
                          </p>
                          {category._count.products > 0 && (
                            <p className="text-destructive font-medium">
                              ⚠️ This category has {category._count.products} product(s). 
                              You must move or delete these products first.
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            This action cannot be undone.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
                          disabled={category._count.products > 0 || deletingId === category.id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Category
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}