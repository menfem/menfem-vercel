// ABOUTME: Admin article creation and editing form component
// ABOUTME: Comprehensive form with validation for article management

'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { Save, Eye, FileText, Settings } from 'lucide-react';
import { createArticle } from '../actions/create-article';
import { updateArticle } from '../actions/update-article';
import type { ActionState } from '@/types/action-state';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  categoryId: string;
  readingTime: number;
  isPremium: boolean;
  isPublished: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags: Array<{ tag: { name: string } }>;
}

interface AdminArticleFormProps {
  categories: Category[];
  article?: Article;
}

const initialState: ActionState = { status: undefined };

export function AdminArticleForm({ categories, article }: AdminArticleFormProps) {
  const [state, formAction] = useActionState(
    article ? updateArticle : createArticle,
    initialState
  );
  
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'seo'>('content');
  const [isPreview, setIsPreview] = useState(false);

  const tagsString = article?.tags.map(t => t.tag.name).join(', ') || '';

  return (
    <div className="max-w-4xl mx-auto">
      <form action={formAction} className="space-y-6">
        {article && <input type="hidden" name="id" value={article.id} />}
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-brand-terracotta text-brand-terracotta'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-brand-terracotta text-brand-terracotta'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seo'
                  ? 'border-brand-terracotta text-brand-terracotta'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              SEO
            </button>
          </nav>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={article?.title}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="Enter article title..."
              />
              {state.fieldErrors?.title && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                defaultValue={article?.subtitle || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="Optional subtitle..."
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                id="excerpt"
                required
                rows={3}
                defaultValue={article?.excerpt}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="Brief description of the article..."
              />
              {state.fieldErrors?.excerpt && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.excerpt[0]}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="inline-flex items-center text-sm text-brand-terracotta hover:text-brand-rust"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              
              {isPreview ? (
                <div className="w-full min-h-[400px] border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="prose max-w-none">
                    {/* Simple markdown-like preview */}
                    {document.querySelector('textarea[name="content"]')?.value
                      ?.split('\n')
                      .map((line, i) => (
                        <p key={i} className="mb-2">
                          {line}
                        </p>
                      )) || <p className="text-gray-500">Start typing to see preview...</p>
                    }
                  </div>
                </div>
              ) : (
                <textarea
                  name="content"
                  id="content"
                  required
                  rows={20}
                  defaultValue={article?.content}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent font-mono text-sm"
                  placeholder="Write your article content here... You can use Markdown formatting."
                />
              )}
              
              {state.fieldErrors?.content && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.content[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  id="categoryId"
                  required
                  defaultValue={article?.categoryId}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {state.fieldErrors?.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{state.fieldErrors.categoryId[0]}</p>
                )}
              </div>

              {/* Reading Time */}
              <div>
                <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Time (minutes)
                </label>
                <input
                  type="number"
                  name="readingTime"
                  id="readingTime"
                  min="1"
                  max="60"
                  defaultValue={article?.readingTime || 5}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                id="coverImage"
                defaultValue={article?.coverImage || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                defaultValue={tagsString}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPremium"
                  id="isPremium"
                  defaultChecked={article?.isPremium}
                  className="h-4 w-4 text-brand-terracotta focus:ring-brand-terracotta border-gray-300 rounded"
                />
                <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
                  Premium content (requires subscription)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  defaultChecked={article?.isPublished}
                  className="h-4 w-4 text-brand-terracotta focus:ring-brand-terracotta border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                id="metaTitle"
                defaultValue={article?.metaTitle || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="SEO title (defaults to article title)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended: 50-60 characters
              </p>
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                id="metaDescription"
                rows={3}
                defaultValue={article?.metaDescription || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-terracotta focus:border-transparent"
                placeholder="SEO description (defaults to excerpt)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended: 150-160 characters
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{state.message}</p>
          </div>
        )}

        {/* Success Message */}
        {state.status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">{state.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-brand-terracotta text-white rounded-md hover:bg-brand-rust transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {article ? 'Update Article' : 'Create Article'}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            All changes are saved when you click save
          </div>
        </div>
      </form>
    </div>
  );
}