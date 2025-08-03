// ABOUTME: Main articles listing page with search, filtering, and pagination
// ABOUTME: Server component that displays all published articles with metadata

import { getArticles } from '@/features/articles/queries/get-articles';
import { ArticleGrid } from '@/components/article-grid';
import { ArticleFilters } from '@/components/article-filters';
import { Pagination } from '@/components/pagination';
import { searchParamsCache } from '@/features/articles/search-params';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Articles | MenFem',
  description: 'Discover insights on culture, style, personal development, and more through our curated articles.',
};

interface ArticlesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = searchParamsCache.parse(resolvedSearchParams);
  
  const { list: articles, metadata } = await getArticles({
    page: parsedParams.page,
    limit: parsedParams.limit,
    search: parsedParams.search || undefined,
    categorySlug: parsedParams.category || undefined,
    tagSlug: parsedParams.tags || undefined,
    orderBy: parsedParams.sortBy as 'createdAt' | 'publishedAt' | 'viewCount',
    orderDirection: parsedParams.sortOrder as 'asc' | 'desc',
  });

  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Page Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-brown mb-4">All Articles</h1>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover insights on culture, style, personal development, and more.
          </p>
          {metadata.count > 0 && (
            <p className="text-sm text-gray-600 mt-4">
              {metadata.count} {metadata.count === 1 ? 'article' : 'articles'} found
            </p>
          )}
        </div>
        
        {/* Filters */}
        <ArticleFilters />
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 pb-16">
        {articles.length > 0 ? (
          <>
            <ArticleGrid articles={articles} />
            {metadata.totalPages > 1 && (
              <div className="mt-12">
                <Pagination 
                  currentPage={metadata.page}
                  totalPages={metadata.totalPages}
                  hasNextPage={metadata.hasNextPage}
                  hasPreviousPage={metadata.hasPreviousPage}
                  basePath="/articles"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">No articles found</h2>
              <p className="text-gray-600 mb-8">
                {parsedParams.search 
                  ? `No articles match your search for "${parsedParams.search}". Try different keywords or browse our categories.`
                  : 'No articles match your current filters. Try adjusting your search criteria.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/articles" 
                  className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
                >
                  View All Articles
                </a>
                <a 
                  href="/" 
                  className="border border-brand-brown text-brand-brown px-6 py-3 rounded font-medium hover:bg-brand-cream transition-colors"
                >
                  Return Home
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}