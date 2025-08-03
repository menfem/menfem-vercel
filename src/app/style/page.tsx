// ABOUTME: Style category page displaying articles about fashion, grooming, and lifestyle
// ABOUTME: Features category-specific header and filtered article listings

import { getArticles } from '@/features/articles/queries/get-articles';
import { CategoryHeader } from '@/components/category-header';
import { ArticleGrid } from '@/components/article-grid';
import { Pagination } from '@/components/pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Style - Fashion, Grooming & Lifestyle | MenFem',
  description: 'Discover the latest in men\'s fashion, grooming tips, and lifestyle advice to elevate your personal style.',
  openGraph: {
    title: 'Style - Fashion, Grooming & Lifestyle | MenFem',
    description: 'Discover the latest in men\'s fashion, grooming tips, and lifestyle advice to elevate your personal style.',
  },
};

interface StylePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StylePage({ searchParams }: StylePageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  
  const { list: articles, metadata } = await getArticles({
    categorySlug: 'style',
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
        title="Style"
        description="Fashion, grooming, and lifestyle advice for the modern man. From timeless classics to contemporary trends, discover how to express your authentic self."
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
                  basePath="/style"
                />
              </div>
            )}
          </>
        )}

        {articles.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">
                No style articles yet
              </h2>
              <p className="text-gray-600 mb-8">
                We're working on bringing you the latest in fashion, grooming, and lifestyle content. Check back soon!
              </p>
              <a 
                href="/articles" 
                className="bg-brand-terracotta text-white px-6 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
              >
                Browse All Articles
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}