// ABOUTME: Search results page with advanced filtering and sorting options
// ABOUTME: Displays search results with metadata and provides fallback suggestions

import { getArticles } from '@/features/articles/queries/get-articles';
import { ArticleGrid } from '@/components/article-grid';
import { SearchFilters } from '@/components/search-filters';
import { Pagination } from '@/components/pagination';
import Link from 'next/link';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q as string || '';
  
  if (query) {
    return {
      title: `Search Results for "${query}" | MenFem`,
      description: `Find articles matching "${query}" on MenFem - culture, style, and personal development content.`,
    };
  }
  
  return {
    title: 'Search Articles | MenFem',
    description: 'Search through our collection of articles on culture, style, and personal development.',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q as string || '';
  const category = searchParams.category as string || '';
  const tags = searchParams.tags as string || '';
  const page = Number(searchParams.page) || 1;
  const sortBy = (searchParams.sortBy as string) || 'publishedAt';
  const sortOrder = (searchParams.sortOrder as string) || 'desc';
  
  const { list: articles, metadata } = await getArticles({
    search: query || undefined,
    categorySlug: category || undefined,
    tagSlug: tags || undefined,
    page,
    limit: 12,
    orderBy: sortBy as 'createdAt' | 'publishedAt' | 'viewCount',
    orderDirection: sortOrder as 'asc' | 'desc',
  });

  return (
    <div className="min-h-screen bg-brand-sage">
      <section className="container mx-auto px-4 py-16">
        {/* Search Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-brown mb-4">
            {query ? `Search Results for "${query}"` : 'Search Articles'}
          </h1>
          {metadata.count > 0 && (
            <p className="text-gray-600">
              Found {metadata.count} {metadata.count === 1 ? 'article' : 'articles'}
              {category && ` in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </p>
          )}
        </div>

        {/* Search Filters */}
        <SearchFilters currentQuery={query} />

        {/* Results */}
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
                  basePath="/search"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">
                {query ? 'No articles found' : 'Start your search'}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {query 
                  ? `No articles match your search for "${query}". Try different keywords or browse our categories below.`
                  : 'Enter a search term above to find articles on culture, style, personal development, and more.'
                }
              </p>
              
              {/* Category Suggestions */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-brand-brown mb-4">
                  Browse by Category
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href="/culture" 
                    className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
                  >
                    Culture
                  </Link>
                  <Link 
                    href="/style" 
                    className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
                  >
                    Style
                  </Link>
                  <Link 
                    href="/personal-development" 
                    className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
                  >
                    Personal Development
                  </Link>
                </div>
              </div>
              
              {/* Popular Searches */}
              {query && (
                <div>
                  <h3 className="text-lg font-medium text-brand-brown mb-4">
                    Try these searches
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['fashion', 'mindfulness', 'film reviews', 'grooming', 'career'].map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        className="bg-white text-brand-brown px-4 py-2 rounded border border-brand-brown hover:bg-brand-cream transition-colors text-sm"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}