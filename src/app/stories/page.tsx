// ABOUTME: Main stories listing page displaying all featured stories and articles
// ABOUTME: Server component with search, filtering, and pagination for story content

import Link from 'next/link';
import { getArticles } from '@/features/articles/queries/get-articles';
import { ArticleGrid } from '@/components/article-grid';
import { ArticleFilters } from '@/components/article-filters';
import { Pagination } from '@/components/pagination';
import { searchParamsCache } from '@/features/articles/search-params';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stories | MenFem',
  description: 'Explore our collection of featured stories, in-depth articles, and thought-provoking content on modern masculinity, culture, and personal development.',
};

interface StoriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = searchParamsCache.parse(resolvedSearchParams);
  
  // Get articles with a focus on longer-form content (stories)
  const { list: stories, metadata } = await getArticles({
    page: parsedParams.page,
    limit: parsedParams.limit,
    search: parsedParams.search || undefined,
    categorySlug: parsedParams.category || undefined,
    tagSlug: parsedParams.tags || undefined,
    orderBy: parsedParams.sortBy as 'createdAt' | 'publishedAt' | 'viewCount',
    orderDirection: parsedParams.sortOrder as 'asc' | 'desc',
    // Only show longer articles (5+ minute read time) for stories
    minReadingTime: 5,
  });

  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-brand-brown mb-6">Stories</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-4">
            Dive deep into thoughtful explorations of modern masculinity, personal growth, 
            and the evolving landscape of what it means to be a man today.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our stories go beyond surface-level advice to explore the nuanced complexities 
            of identity, relationships, and purposeful living.
          </p>
          {metadata.count > 0 && (
            <p className="text-sm text-gray-600 mt-6">
              {metadata.count} {metadata.count === 1 ? 'story' : 'stories'} available
            </p>
          )}
        </div>
        
        {/* Filters */}
        <ArticleFilters />
      </section>

      {/* Stories Grid */}
      <section className="container mx-auto px-4 pb-16">
        {stories.length > 0 ? (
          <>
            <ArticleGrid articles={stories} variant="story" />
            {metadata.totalPages > 1 && (
              <div className="mt-12">
                <Pagination 
                  currentPage={metadata.page}
                  totalPages={metadata.totalPages}
                  hasNextPage={metadata.hasNextPage}
                  hasPreviousPage={metadata.hasPreviousPage}
                  basePath="/stories"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">No stories found</h2>
              <p className="text-gray-600 mb-8">
                {parsedParams.search 
                  ? `No stories match your search for "${parsedParams.search}". Try different keywords or browse our categories.`
                  : 'No stories match your current filters. Try adjusting your search criteria.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/stories" 
                  className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
                >
                  View All Stories
                </Link>
                <Link 
                  href="/articles" 
                  className="border border-brand-brown text-brand-brown px-6 py-3 rounded font-medium hover:bg-brand-cream transition-colors"
                >
                  Browse Articles
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-brand-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-brand-brown mb-4">Want to Share Your Story?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            We&apos;re always looking for authentic voices and meaningful perspectives. 
            Join our community of thoughtful writers and contributors.
          </p>
          <a 
            href="/newsletter/subscribe" 
            className="inline-block bg-brand-brown text-white px-8 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
          >
            Join Our Community
          </a>
        </div>
      </section>
    </div>
  );
}