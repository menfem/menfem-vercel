// ABOUTME: Dynamic article detail page with SEO optimization and metadata generation
// ABOUTME: Fetches article by slug and renders ArticleDetail component with proper error handling

import { getArticleBySlug } from '@/features/articles/queries/get-article';
import { getAuth } from '@/features/auth/queries/get-auth';
import { ArticleDetail } from '@/components/article-detail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      authors: [article.author.username || article.author.email],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const [article, auth] = await Promise.all([
    getArticleBySlug(params.slug),
    getAuth(),
  ]);

  if (!article || !article.isPublished) {
    notFound();
  }

  return <ArticleDetail article={article} user={auth.user} />;
}