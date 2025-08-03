// ABOUTME: Article card component for displaying articles in grid layouts
// ABOUTME: Supports multiple variants and displays full article metadata

import Image from "next/image";
import Link from "next/link";
import type { ArticleListItem } from '@/features/articles/types';

interface ArticleCardProps {
  article: ArticleListItem;
  variant?: 'default' | 'featured' | 'compact';
  showCategory?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
}

// Legacy props for backward compatibility
interface LegacyArticleCardProps {
  title: string;
  category: string;
  imageUrl: string;
  href: string;
  author?: string;
  date?: string;
  size?: "small" | "medium" | "large";
}

// Overloaded function signatures
export function ArticleCard(props: ArticleCardProps): JSX.Element;
export function ArticleCard(props: LegacyArticleCardProps): JSX.Element;
export function ArticleCard(props: ArticleCardProps | LegacyArticleCardProps): JSX.Element {
  // Legacy mode check
  if ('title' in props && 'category' in props && 'imageUrl' in props) {
    return <LegacyArticleCard {...props} />;
  }

  // New mode
  const {
    article,
    variant = 'default',
    showCategory = true,
    showExcerpt = true,
    showAuthor = true,
  } = props as ArticleCardProps;

  const cardClasses = {
    default: 'bg-white hover:shadow-xl transition-shadow duration-300 group rounded-lg overflow-hidden',
    featured: 'bg-white hover:shadow-xl transition-shadow duration-300 group lg:col-span-2 rounded-lg overflow-hidden',
    compact: 'bg-white hover:shadow-lg transition-shadow duration-300 group flex gap-4 rounded-lg overflow-hidden p-4',
  };

  const imageClasses = {
    default: 'aspect-[16/9] w-full',
    featured: 'aspect-[21/9] w-full',
    compact: 'aspect-square w-24 h-24 flex-shrink-0',
  };

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <Link href={`/articles/${article.slug}`} className={cardClasses[variant]}>
      {/* Cover Image */}
      {article.coverImage && (
        <div className={`relative overflow-hidden ${variant === 'compact' ? '' : 'mb-0'} ${imageClasses[variant]}`}>
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={variant === 'featured' ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          {article.isPremium && (
            <div className="absolute top-4 right-4">
              <span className="bg-brand-terracotta text-white px-2 py-1 text-xs font-medium rounded">
                Premium
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={variant === 'compact' ? 'flex-1' : 'p-6'}>
        {/* Category Badge */}
        {showCategory && (
          <div className="mb-3">
            <span className="bg-brand-terracotta text-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded">
              {article.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className={`font-bold text-brand-brown group-hover:text-brand-terracotta transition-colors line-clamp-2 leading-tight ${
          variant === 'featured' ? 'text-2xl mb-3' : 
          variant === 'compact' ? 'text-base mb-2' : 'text-xl mb-3'
        }`}>
          {article.title}
        </h3>

        {/* Excerpt */}
        {showExcerpt && variant !== 'compact' && article.excerpt && (
          <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {showAuthor && (
            <span>By {article.author.username || article.author.email}</span>
          )}
          <div className="flex items-center gap-4">
            <time dateTime={article.publishedAt?.toISOString()}>
              {publishedDate}
            </time>
            <span>{article.readingTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Legacy component for backward compatibility
function LegacyArticleCard({
  title,
  category,
  imageUrl,
  href,
  author,
  date,
  size = "medium"
}: LegacyArticleCardProps) {
  const aspectRatio = size === "large" ? "aspect-[4/3]" : "aspect-[16/9]";
  const titleSize = {
    small: "text-lg",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl"
  }[size];

  return (
    <article className="group">
      <Link href={href} className="block">
        <div className={`relative ${aspectRatio} overflow-hidden mb-4`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={size === "large" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-brand-terracotta font-medium text-xs uppercase tracking-wide">
            {category}
          </p>
          <h3 className={`font-bold leading-tight group-hover:text-brand-terracotta transition-colors ${titleSize}`}>
            {title}
          </h3>
          
          {(author || date) && (
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              {author && <span>{author}</span>}
              {author && date && <span>•</span>}
              {date && <span>{date}</span>}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}