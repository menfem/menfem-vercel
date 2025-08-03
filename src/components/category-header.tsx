// ABOUTME: Category page header component with featured article and metadata
// ABOUTME: Displays category information, stats, and featured content

import { ArticleCard } from '@/components/article-card';
import type { ArticleListItem } from '@/features/articles/types';

interface CategoryHeaderProps {
  title: string;
  description: string;
  featuredArticle?: ArticleListItem;
  totalArticles: number;
}

export function CategoryHeader({ 
  title, 
  description, 
  featuredArticle, 
  totalArticles 
}: CategoryHeaderProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
          {description}
        </p>
        <div className="text-sm text-gray-600">
          {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-brown mb-8 text-center">
            Featured Article
          </h2>
          <div className="max-w-4xl mx-auto">
            <ArticleCard
              article={featuredArticle}
              variant="featured"
              showCategory={false}
            />
          </div>
        </div>
      )}
    </section>
  );
}