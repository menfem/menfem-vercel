// ABOUTME: Admin article editing page
// ABOUTME: Provides form interface for editing existing articles

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminArticleForm } from '@/features/admin/components/admin-article-form';
import { getAdminArticle } from '@/features/admin/queries/get-admin-articles';
import { getCategories } from '@/features/admin/queries/get-categories';

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const [article, categories] = await Promise.all([
    getAdminArticle(params.id),
    getCategories()
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href={`/admin/articles/${article.id}`}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-600">{article.title}</p>
        </div>
      </div>

      {/* Form */}
      <AdminArticleForm categories={categories} article={article} />
    </div>
  );
}