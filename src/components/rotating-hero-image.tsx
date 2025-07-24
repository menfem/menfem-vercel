// ABOUTME: Rotating hero image component that changes images every second
// ABOUTME: Inspired by Service95's dynamic visual presentation

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1600&h=900&fit=crop",
    alt: "Professional man in suit"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=900&fit=crop",
    alt: "Casual style portrait"
  },
  {
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1600&h=900&fit=crop",
    alt: "Modern lifestyle"
  },
  {
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1600&h=900&fit=crop",
    alt: "Contemporary fashion"
  },
  {
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1600&h=900&fit=crop",
    alt: "Urban professional"
  }
]

export function RotatingHeroImage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      )
    }, 1000) // Change every second

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-lg">
      {HERO_IMAGES.map((image, index) => (
        <div
          key={image.url}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Subtle overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}