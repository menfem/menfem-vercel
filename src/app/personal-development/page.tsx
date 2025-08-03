// ABOUTME: Personal Development category page displaying articles about growth and self-improvement
// ABOUTME: Features category-specific header and filtered article listings

import { getArticles } from '@/features/articles/queries/get-articles';
import { CategoryHeader } from '@/components/category-header';
import { ArticleGrid } from '@/components/article-grid';
import { Pagination } from '@/components/pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Development - Growth & Self-Improvement | MenFem',
  description: 'Transform your life with insights on personal growth, career advancement, relationships, and mindfulness.',
  openGraph: {
    title: 'Personal Development - Growth & Self-Improvement | MenFem',
    description: 'Transform your life with insights on personal growth, career advancement, relationships, and mindfulness.',
  },
};

interface PersonalDevelopmentPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PersonalDevelopmentPage({ searchParams }: PersonalDevelopmentPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  
  const { list: articles, metadata } = await getArticles({
    categorySlug: 'personal-development',
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
        title="Personal Development"
        description="Growth, self-improvement, and mindfulness for the modern man. Discover strategies to enhance your career, relationships, and overall well-being."
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
                  basePath="/personal-development"
                />
              </div>
            )}
          </>
        )}

        {articles.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">
                No personal development articles yet
              </h2>
              <p className="text-gray-600 mb-8">
                We're working on bringing you transformative content about growth, mindfulness, and success. Check back soon!
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