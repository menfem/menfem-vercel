// ABOUTME: Admin article action dropdown menu
// ABOUTME: Provides quick actions like publish/unpublish, delete, and more

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toggleArticleStatus, deleteArticle } from '../actions/delete-article';
import { toast } from 'sonner';

interface AdminArticleActionsProps {
  article: {
    id: string;
    title: string;
    isPublished: boolean;
  };
}

export function AdminArticleActions({ article }: AdminArticleActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const result = await toggleArticleStatus(article.id, !article.isPublished);
      if (result.status === 'success') {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update article status');
    }
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', article.id);
      
      const result = await deleteArticle({ status: undefined }, formData);
      if (result.status === 'error') {
        toast.error(result.message);
      }
      // Success case handles redirect automatically
    } catch (error) {
      toast.error('Failed to delete article');
    }
    setIsLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        title="More Actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={handleToggleStatus}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
              >
                {article.isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}