// ABOUTME: Component displaying previous monthly reading recommendations in a carousel format
// ABOUTME: Shows book covers from different months with navigation arrows

"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MonthlyRead {
  month: string
  year: number
  bookTitle: string
  author: string
  coverUrl: string
  link: string
}

// Sample data - replace with actual data from your CMS/API
const MONTHLY_READS: MonthlyRead[] = [
  {
    month: "January",
    year: 2025,
    bookTitle: "The Creative Act",
    author: "Rick Rubin",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    link: "/reading/creative-act"
  },
  {
    month: "February", 
    year: 2025,
    bookTitle: "Atomic Habits",
    author: "James Clear",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
    link: "/reading/atomic-habits"
  },
  {
    month: "March",
    year: 2025,
    bookTitle: "Sapiens",
    author: "Yuval Noah Harari",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    link: "/reading/sapiens"
  },
  {
    month: "April",
    year: 2025,
    bookTitle: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    link: "/reading/body-keeps-score"
  },
  {
    month: "May",
    year: 2025,
    bookTitle: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverUrl: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=300&h=450&fit=crop",
    link: "/reading/thinking-fast-slow"
  },
  {
    month: "June",
    year: 2025,
    bookTitle: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop",
    link: "/reading/mans-search-meaning"
  },
  {
    month: "July",
    year: 2025,
    bookTitle: "The Alchemist",
    author: "Paulo Coelho",
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
    link: "/reading/alchemist"
  }
]

export function MonthlyReads() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsToShow = 6

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex(Math.min(MONTHLY_READS.length - itemsToShow, currentIndex + 1))
  }

  const visibleReads = MONTHLY_READS.slice(currentIndex, currentIndex + itemsToShow)

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-brand-brown">Previous Monthly Reads</h2>
      
      <div className="relative">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg transition-opacity ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
          }`}
          aria-label="Previous books"
        >
          <ChevronLeft className="w-6 h-6 text-brand-brown" />
        </button>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-12">
          {visibleReads.map((read) => (
            <a
              key={`${read.month}-${read.year}`}
              href={read.link}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] mb-2 overflow-hidden bg-gray-100">
                <Image
                  src={read.coverUrl}
                  alt={`${read.bookTitle} by ${read.author}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {read.month} {read.year}
              </p>
            </a>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= MONTHLY_READS.length - itemsToShow}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg transition-opacity ${
            currentIndex >= MONTHLY_READS.length - itemsToShow 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-xl'
          }`}
          aria-label="Next books"
        >
          <ChevronRight className="w-6 h-6 text-brand-brown" />
        </button>
      </div>
    </section>
  )
}