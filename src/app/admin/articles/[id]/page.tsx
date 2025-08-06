// ABOUTME: Admin article detail view page
// ABOUTME: Shows comprehensive article information and management options

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { 
  ArrowLeft, 
  Edit, 
  ExternalLink, 
  Eye, 
  Calendar,
  User,
  Tag,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import { getAdminArticle } from '@/features/admin/queries/get-admin-articles';
import { AdminArticleActions } from '@/features/admin/components/admin-article-actions';

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = await getAdminArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/articles"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Article Details</h1>
            <p className="text-gray-600">Manage and review article content</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {article.isPublished && (
            <Link
              href={`/articles/${article.slug}`}
              target="_blank"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live
            </Link>
          )}
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="inline-flex items-center px-3 py-2 bg-brand-terracotta text-white rounded-md hover:bg-brand-rust transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Article
          </Link>
          <AdminArticleActions article={article} />
        </div>
      </div>

      {/* Article Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Image */}
        {article.coverImage && (
          <div className="aspect-[16/9] w-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
              fill
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {article.title}
              </h2>
              {article.subtitle && (
                <p className="text-xl text-gray-600 mb-4">
                  {article.subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                article.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {article.isPublished ? 'Published' : 'Draft'}
              </span>
              {article.isPremium && (
                <span className="inline-flex px-3 py-1 text-sm font-semibold bg-purple-100 text-purple-800 rounded-full">
                  Premium
                </span>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>{article.author.username}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="h-4 w-4 mr-2" />
              <span>{article.category.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Eye className="h-4 w-4 mr-2" />
              <span>{article.viewCount} views</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tagRelation) => (
                  <span
                    key={tagRelation.tag.name}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    #{tagRelation.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-1">
            <div>
              Created: {formatDistance(new Date(article.createdAt), new Date(), { addSuffix: true })}
            </div>
            <div>
              Updated: {formatDistance(new Date(article.updatedAt), new Date(), { addSuffix: true })}
            </div>
            {article.publishedAt && (
              <div>
                Published: {formatDistance(new Date(article.publishedAt), new Date(), { addSuffix: true })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h3>
        <div className="prose max-w-none">
          <div className="text-gray-700 whitespace-pre-wrap">
            {article.content.length > 500 
              ? `${article.content.substring(0, 500)}...\n\n[Content continues...]`
              : article.content
            }
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href={`/admin/articles/${article.id}/edit`}
            className="text-brand-terracotta hover:text-brand-rust font-medium"
          >
            Edit full content →
          </Link>
        </div>
      </div>

      {/* Stats and Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Eye className="h-4 w-4 mr-2" />
                Total Views
              </span>
              <span className="font-semibold">{article.viewCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comments
              </span>
              <span className="font-semibold">{article._count.comments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-gray-600">
                <Bookmark className="h-4 w-4 mr-2" />
                Saves
              </span>
              <span className="font-semibold">{article._count.savedBy}</span>
            </div>
          </div>
        </div>

        {/* SEO Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Title</label>
              <p className="text-sm text-gray-600 mt-1">
                {article.metaTitle || article.title}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              <p className="text-sm text-gray-600 mt-1">
                {article.metaDescription || article.excerpt}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">URL Slug</label>
              <p className="text-sm text-gray-600 mt-1 font-mono">
                /articles/{article.slug}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Comments */}
      {article.comments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h3>
          <div className="space-y-4">
            {article.comments.slice(0, 5).map((comment) => (
              <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {comment.user.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            {article.comments.length > 5 && (
              <p className="text-sm text-gray-500">
                And {article.comments.length - 5} more comments...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}