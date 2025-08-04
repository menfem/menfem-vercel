// ABOUTME: Admin new article creation page
// ABOUTME: Provides form interface for creating new articles

import { AdminArticleForm } from '@/features/admin/components/admin-article-form';
import { getCategories } from '@/features/admin/queries/get-categories';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/articles"
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
          <p className="text-gray-600">Write and publish new content</p>
        </div>
      </div>

      {/* Form */}
      <AdminArticleForm categories={categories} />
    </div>
  );
}