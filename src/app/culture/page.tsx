// ABOUTME: Culture category page displaying articles about film, music, art, and books
// ABOUTME: Features category-specific header and filtered article listings

import Link from 'next/link';
import { getArticles } from '@/features/articles/queries/get-articles';
import { CategoryHeader } from '@/components/category-header';
import { ArticleGrid } from '@/components/article-grid';
import { Pagination } from '@/components/pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Culture - Film, Music, Art & Books | MenFem',
  description: 'Explore culture through our curated articles on film, music, art, books, and photography.',
  openGraph: {
    title: 'Culture - Film, Music, Art & Books | MenFem',
    description: 'Explore culture through our curated articles on film, music, art, books, and photography.',
  },
};

interface CulturePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CulturePage({ searchParams }: CulturePageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  
  const { list: articles, metadata } = await getArticles({
    categorySlug: 'culture',
    page,
    limit,
    orderBy: 'publishedAt',
    orderDirection: 'desc',
  });

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Category Header */}
      <CategoryHeader
        title="Culture"
        description="Film, music, literature, and cultural commentary for the modern man. Dive deep into the arts that shape our world and expand your cultural horizons."
        featuredArticle={featuredArticle}
        totalArticles={metadata.count}
      />

      {/* Articles Section */}
      <section className="container mx-auto px-4 pb-16">
        {regularArticles.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-brand-brown mb-8 text-center">
              Latest Articles
            </h2>
            <ArticleGrid articles={regularArticles} showCategory={false} />
            
            {metadata.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={metadata.page}
                  totalPages={metadata.totalPages}
                  hasNextPage={metadata.hasNextPage}
                  hasPreviousPage={metadata.hasPreviousPage}
                  basePath="/culture"
                />
              </div>
            )}
          </>
        )}

        {articles.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">
                No culture articles yet
              </h2>
              <p className="text-gray-600 mb-8">
                We&apos;re working on bringing you amazing content about film, music, art, and more. Check back soon!
              </p>
              <Link 
                href="/articles" 
                className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
              >
                Browse All Articles
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}