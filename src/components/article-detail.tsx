// ABOUTME: Main article detail component with hero section, content display, and metadata
// ABOUTME: Handles premium content paywall and displays related article tags

import Image from 'next/image';
import Link from 'next/link';
import type { ArticleWithRelations } from '@/features/articles/types';
import type { User } from 'lucia';

interface ArticleDetailProps {
  article: ArticleWithRelations;
  user?: User | null;
}

export function ArticleDetail({ article, user }: ArticleDetailProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Hero Section */}
      <section className="relative">
        {article.coverImage && (
          <div className="relative h-96 lg:h-[500px]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        
        {/* Article Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <Link 
              href={`/${article.category.slug}`}
              className="inline-block bg-brand-terracotta text-white px-4 py-2 text-sm font-medium mb-4 hover:bg-brand-rust transition-colors rounded"
            >
              {article.category.name}
            </Link>
            
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-4 leading-tight">
              {article.title}
            </h1>
            
            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {article.subtitle}
              </p>
            )}
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
              <span>By {article.author.username || article.author.email}</span>
              <span>•</span>
              <time dateTime={article.publishedAt?.toISOString()}>
                {publishedDate}
              </time>
              <span>•</span>
              <span>{article.readingTime} min read</span>
              <span>•</span>
              <span>{article.viewCount} views</span>
              {article.isPremium && (
                <>
                  <span>•</span>
                  <span className="text-brand-terracotta font-medium">Premium</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Premium Paywall */}
          {article.isPremium && !user && (
            <div className="bg-white border border-brand-terracotta rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-brown mb-2">
                Premium Content
              </h3>
              <p className="text-gray-600 mb-4">
                This article is available to premium subscribers. Sign up to access exclusive content.
              </p>
              <Link 
                href="/register" 
                className="bg-brand-terracotta text-white px-6 py-2 rounded font-medium hover:bg-brand-rust transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          )}
          
          {/* Article Body */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
            {article.excerpt && (
              <div className="text-lg text-gray-700 mb-8 p-4 bg-brand-cream rounded-lg italic leading-relaxed">
                {article.excerpt}
              </div>
            )}
            
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }} 
                className="article-content"
              />
            </div>
          </div>
          
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-medium text-brand-brown mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="bg-brand-cream text-brand-brown px-4 py-2 text-sm hover:bg-brand-sand transition-colors rounded"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Article Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <span>{article._count.comments} comments</span>
                <span>{article._count.savedBy} saves</span>
                <span>{article.viewCount} views</span>
              </div>
              <div className="text-xs">
                Published {publishedDate}
                {article.updatedAt.getTime() !== article.createdAt.getTime() && (
                  <span className="ml-2">
                    • Updated {new Date(article.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}