// ABOUTME: Admin articles list component with management actions
// ABOUTME: Displays articles in a table format with edit/delete/publish controls

import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { 
  Eye, 
  Edit, 
  ExternalLink,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { getAdminArticles } from '../queries/get-admin-articles';
import { AdminArticleActions } from './admin-article-actions';
import { AdminPagination } from './admin-pagination';

interface AdminArticlesListProps {
  search?: string;
  published?: boolean;
  category?: string;
  page?: number;
}

export async function AdminArticlesList({
  search,
  published,
  category,
  page = 1
}: AdminArticlesListProps) {
  const result = await getAdminArticles({
    search,
    published,
    category,
    page,
    limit: 20
  });

  const { articles, pagination } = result;

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-12 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-6">
            {search || published !== undefined || category 
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first article.'
            }
          </p>
          {!search && published === undefined && !category && (
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center px-4 py-2 bg-brand-terracotta text-white rounded-md hover:bg-brand-rust transition-colors"
            >
              Create Your First Article
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Articles ({pagination.total})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  {/* Article Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {article.coverImage && (
                        <img
                          src={article.coverImage}
                          alt=""
                          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-brand-terracotta line-clamp-2"
                        >
                          {article.title}
                        </Link>
                        {article.subtitle && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {article.subtitle}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <Tag className="h-3 w-3 mr-1" />
                            {article.category.name}
                          </span>
                          {article.readingTime && (
                            <span className="text-xs text-gray-500">
                              {article.readingTime} min read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        article.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {article.isPremium && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {article.author.username}
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.viewCount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {article._count.comments} comments
                      </div>
                    </div>
                  </td>

                  {/* Updated */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDistance(new Date(article.updatedAt), new Date(), { addSuffix: true })}
                      </div>
                      {article.publishedAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Published {formatDistance(new Date(article.publishedAt), new Date(), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {article.isPublished && (
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Article"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-2 text-gray-400 hover:text-brand-terracotta transition-colors"
                        title="Edit Article"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <AdminArticleActions article={article} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <AdminPagination pagination={pagination} />
      )}
    </div>
  );
}