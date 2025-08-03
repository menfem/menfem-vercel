// ABOUTME: Search modal component with full-screen overlay and search functionality
// ABOUTME: Appears when search button is clicked in navigation

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Search } from "lucide-react"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
      setSearchQuery("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-brand-sage">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-sand rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-brand-brown" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center border-b-2 border-brand-brown pb-4">
            <Search className="h-6 w-6 text-brand-rust mr-4" />
            <input
              type="text"
              placeholder="Search Menfem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-2xl md:text-3xl outline-none placeholder-brand-rust bg-transparent text-brand-brown"
              autoFocus
            />
          </div>

          {searchQuery && (
            <div className="mt-8">
              <p className="text-brand-rust mb-4">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {["Style", "Tech", "Fitness", "Culture", "Finance"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-brand-cream hover:bg-brand-sand rounded-full text-sm transition-colors text-brand-brown"
                    onClick={() => handleSearch(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}