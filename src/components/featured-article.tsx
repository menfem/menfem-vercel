// ABOUTME: Featured article component for homepage hero section with large image and headline
// ABOUTME: Displays a single featured article with prominent visual design

import Image from "next/image"
import Link from "next/link"

interface FeaturedArticleProps {
  title: string
  category: string
  excerpt: string
  imageUrl: string
  href: string
  author?: string
  readTime?: string
}

export function FeaturedArticle({
  title,
  category,
  excerpt,
  imageUrl,
  href,
  author,
  readTime
}: FeaturedArticleProps) {
  return (
    <article className="relative">
      <Link href={href} className="group block">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <p className="text-brand-terracotta font-medium text-sm uppercase tracking-wide mb-3">
              {category}
            </p>
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 max-w-4xl">
              {title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-4">
              {excerpt}
            </p>
            {(author || readTime) && (
              <div className="flex items-center gap-4 text-white/70 text-sm">
                {author && <span>By {author}</span>}
                {author && readTime && <span>•</span>}
                {readTime && <span>{readTime} read</span>}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}