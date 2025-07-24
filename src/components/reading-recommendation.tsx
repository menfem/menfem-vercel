// ABOUTME: Weekly reading recommendation component inspired by Service95's book club
// ABOUTME: Features book cover, title, author, and description in a clean layout

import Image from "next/image"
import Link from "next/link"

interface ReadingRecommendationProps {
  bookTitle: string
  author: string
  coverUrl: string
  description: string
  ctaText?: string
  ctaUrl?: string
}

export function ReadingRecommendation({
  bookTitle,
  author,
  coverUrl,
  description,
  ctaText = "EXPLORE THIS WEEK'S READ",
  ctaUrl = "/reading"
}: ReadingRecommendationProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-brown">
            This Week's Reading Recommendation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each week, we curate a book that challenges perspectives and enriches understanding of modern masculinity, culture, and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Book Cover */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src={coverUrl}
                alt={`${bookTitle} by ${author}`}
                width={400}
                height={600}
                className="shadow-2xl rounded-lg"
              />
              {/* Decorative circle element like Service95 */}
              <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full border-2 border-brand-terracotta/20 -z-10" />
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-brand-brown mb-2">
                {bookTitle}
              </h3>
              <p className="text-xl text-brand-terracotta">by {author}</p>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              {description}
            </p>

            <Link 
              href={ctaUrl}
              className="inline-block bg-brand-terracotta hover:bg-brand-rust text-white font-bold py-3 px-8 transition-colors uppercase tracking-wide text-sm"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}