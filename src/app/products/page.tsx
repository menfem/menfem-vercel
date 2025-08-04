// ABOUTME: Products category page displaying articles about tech, gear, and product reviews
// ABOUTME: Features category-specific header and filtered article listings

import { getArticles } from '@/features/articles/queries/get-articles';
import { CategoryHeader } from '@/components/category-header';
import { ArticleGrid } from '@/components/article-grid';
import { Pagination } from '@/components/pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Tech, Gear & Reviews | MenFem',
  description: 'Discover the best products, gear, and tech reviews for the modern man. From gadgets to everyday essentials.',
  openGraph: {
    title: 'Products - Tech, Gear & Reviews | MenFem',
    description: 'Discover the best products, gear, and tech reviews for the modern man. From gadgets to everyday essentials.',
  },
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  
  const { list: articles, metadata } = await getArticles({
    categorySlug: 'products',
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
        title="Products"
        description="Tech, gear, and product reviews for the discerning gentleman. Discover essential tools and products that enhance your daily life and productivity."
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
                  basePath="/products"
                />
              </div>
            )}
          </>
        )}

        {articles.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-brand-brown mb-4">
                No product reviews yet
              </h2>
              <p className="text-gray-600 mb-8">
                We're working on bringing you comprehensive reviews of the best products and gear. Check back soon!
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