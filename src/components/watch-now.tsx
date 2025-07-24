// ABOUTME: Component displaying video content recommendations with embedded YouTube players
// ABOUTME: Shows featured videos in a grid layout with play buttons and titles

"use client"

import { Play } from "lucide-react"
import Image from "next/image"

interface Video {
  id: string
  title: string
  author: string
  thumbnailUrl: string
  youtubeId: string
  bookClub?: {
    number: string
    label: string
  }
}

// Sample data - replace with actual data from your CMS/API
const FEATURED_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Dua Lipa In Conversation With Vincent Delecroix",
    author: "Dua Lipa",
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    bookClub: {
      number: "#003",
      label: "SERVICE95 BOOK CLUB"
    }
  },
  {
    id: "2",
    title: "In Conversation With Vincent Delecroix, Author of Small Rain",
    author: "Vincent Delecroix",
    thumbnailUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    id: "3",
    title: "Dua Lipa In Conversation With Jeremy O. Harris",
    author: "Dua Lipa",
    thumbnailUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    bookClub: {
      number: "#002",
      label: "SERVICE95 BOOK CLUB"
    }
  },
  {
    id: "4",
    title: "INTERVIEW: Josephine Baker",
    author: "Josephine Baker",
    thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
    youtubeId: "dQw4w9WgXcQ"
  }
]

export function WatchNow() {
  const handleVideoClick = (youtubeId: string) => {
    // Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-brand-brown">Watch Now</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_VIDEOS.map((video) => (
          <div
            key={video.id}
            className="group cursor-pointer"
            onClick={() => handleVideoClick(video.youtubeId)}
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video mb-3 overflow-hidden bg-gray-100">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              {/* Book Club Badge */}
              {video.bookClub && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1">
                  <div className="text-xs font-bold">{video.bookClub.label}</div>
                  <div className="text-sm font-bold">{video.bookClub.number}</div>
                </div>
              )}

              {/* YouTube Logo */}
              <div className="absolute bottom-4 left-4 bg-white rounded px-2 py-1 flex items-center gap-1">
                <span className="text-xs font-medium">Watch on</span>
                <svg className="w-12 h-3" viewBox="0 0 90 20" fill="none">
                  <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                  <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                </svg>
              </div>
            </div>

            {/* Video Info */}
            <h3 className="font-medium text-gray-900 group-hover:text-brand-terracotta transition-colors line-clamp-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{video.author}</p>
          </div>
        ))}
      </div>
    </section>
  )
}