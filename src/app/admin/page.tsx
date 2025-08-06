// ABOUTME: Admin dashboard overview page
// ABOUTME: Shows key statistics and recent activity for content management

import Link from 'next/link';
import { 
  FileText, 
  Users, 
  Eye, 
  Plus,
  TrendingUp
} from 'lucide-react';
import { getArticleStats } from '@/features/admin/queries/get-admin-articles';
import { getAdminArticles } from '@/features/admin/queries/get-admin-articles';
import { formatDistance } from 'date-fns';

export default async function AdminDashboard() {
  const [stats, recentArticles] = await Promise.all([
    getArticleStats(),
    getAdminArticles({ limit: 5 })
  ]);

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/articles'
    },
    {
      title: 'Published',
      value: stats.publishedArticles,
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/admin/articles?published=true'
    },
    {
      title: 'Drafts',
      value: stats.draftArticles,
      icon: FileText,
      color: 'bg-yellow-500',
      href: '/admin/articles?published=false'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
      href: '/admin/articles'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your content and site settings</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center px-4 py-2 bg-brand-terracotta text-white rounded-md hover:bg-brand-rust transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-md`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2>
            <Link
              href="/admin/articles"
              className="text-brand-terracotta hover:text-brand-rust text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentArticles.articles.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first article</p>
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center px-4 py-2 bg-brand-terracotta text-white rounded-md hover:bg-brand-rust transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Link>
            </div>
          ) : (
            recentArticles.articles.map((article) => (
              <div key={article.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-brand-terracotta truncate"
                      >
                        {article.title}
                      </Link>
                      <div className="flex space-x-2">
                        {article.isPublished ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                            Draft
                          </span>
                        )}
                        {article.isPremium && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {article.author.username}</span>
                      <span>{article.category.name}</span>
                      <span>{article.viewCount} views</span>
                      <span>{formatDistance(new Date(article.updatedAt), new Date(), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-brand-terracotta hover:text-brand-rust text-sm font-medium"
                    >
                      Edit
                    </Link>
                    {article.isPublished && (
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/articles/new"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-brand-terracotta p-3 rounded-md">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-terracotta">
                Create Article
              </h3>
              <p className="text-sm text-gray-600">Write and publish new content</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/articles?published=false"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-md">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-terracotta">
                Review Drafts
              </h3>
              <p className="text-sm text-gray-600">Manage unpublished articles</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-terracotta">
                Manage Users
              </h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}