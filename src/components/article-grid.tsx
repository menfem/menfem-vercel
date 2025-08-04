// ABOUTME: Responsive grid component for displaying article lists in different layouts
// ABOUTME: Supports grid, list, and featured variants with flexible configuration

import { ArticleCard } from '@/components/article-card';
import type { ArticleListItem } from '@/features/articles/types';

interface ArticleGridProps {
  articles: ArticleListItem[];
  showCategory?: boolean;
  showAuthor?: boolean;
  variant?: 'grid' | 'list' | 'featured' | 'story';
}

export function ArticleGrid({ 
  articles, 
  showCategory = true, 
  showAuthor = true,
  variant = 'grid' 
}: ArticleGridProps) {
  const gridClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    list: 'space-y-8',
    featured: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
    story: 'grid grid-cols-1 md:grid-cols-2 gap-8',
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={gridClasses[variant]}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          variant={
            variant === 'featured' && index === 0 
              ? 'featured' 
              : variant === 'story' 
                ? 'story' 
                : 'default'
          }
          showCategory={showCategory}
          showAuthor={showAuthor}
        />
      ))}
    </div>
  );
}