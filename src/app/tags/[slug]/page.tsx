// ABOUTME: Tag-based article listing page for specific topic filtering
// ABOUTME: Displays articles tagged with a specific topic with proper SEO

import { getArticles } from '@/features/articles/queries/get-articles';
import { ArticleGrid } from '@/components/article-grid';
import { Pagination } from '@/components/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tagName = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${tagName} Articles | MenFem`,
    description: `Discover articles about ${tagName.toLowerCase()} - insights, tips, and perspectives on this topic.`,
    openGraph: {
      title: `${tagName} Articles | MenFem`,
      description: `Discover articles about ${tagName.toLowerCase()} - insights, tips, and perspectives on this topic.`,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  
  const { list: articles, metadata } = await getArticles({
    tagSlug: resolvedParams.slug,
    page,
    limit,
    orderBy: 'publishedAt',
    orderDirection: 'desc',
  });

  // If no articles found for this tag, show 404
  if (metadata.count === 0) {
    notFound();
  }

  const tagName = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Tag Header */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="bg-brand-terracotta text-white px-4 py-2 rounded-full text-sm font-medium">
              #{resolvedParams.slug}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-brown mb-4">
            {tagName}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore our collection of articles about {tagName.toLowerCase()}.
          </p>
          <div className="text-sm text-gray-600">
            {metadata.count} {metadata.count === 1 ? 'article' : 'articles'}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="container mx-auto px-4 pb-16">
        <ArticleGrid articles={articles} />
        
        {metadata.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={metadata.page}
              totalPages={metadata.totalPages}
              hasNextPage={metadata.hasNextPage}
              hasPreviousPage={metadata.hasPreviousPage}
              basePath={`/tags/${resolvedParams.slug}`}
            />
          </div>
        )}
      </section>
    </div>
  );
}