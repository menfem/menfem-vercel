// ABOUTME: Article card component for displaying articles in grid layouts
// ABOUTME: Used in Editor's Favourites and The Latest sections

import Image from "next/image"
import Link from "next/link"

interface ArticleCardProps {
  title: string
  category: string
  imageUrl: string
  href: string
  author?: string
  date?: string
  size?: "small" | "medium" | "large"
}

export function ArticleCard({
  title,
  category,
  imageUrl,
  href,
  author,
  date,
  size = "medium"
}: ArticleCardProps) {
  const aspectRatio = size === "large" ? "aspect-[4/3]" : "aspect-[16/9]"
  const titleSize = {
    small: "text-lg",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl"
  }[size]

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
  )
}