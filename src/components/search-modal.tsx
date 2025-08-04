// ABOUTME: Search modal component with full-screen overlay and search functionality
// ABOUTME: Appears when search button is clicked in navigation

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { SearchWithSuggestions } from '@/features/search/components/search-with-suggestions'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // The SearchWithSuggestions component handles navigation
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
          <div className="mb-4">
            <SearchWithSuggestions
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Menfem..."
              className="text-2xl"
            />
          </div>

          {searchQuery && (
            <div className="mt-8">
              <p className="text-brand-rust mb-4">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {["Style", "Culture", "Personal Development", "Fashion", "Mindfulness"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-brand-cream hover:bg-brand-sand rounded-full text-sm transition-colors text-brand-brown"
                    onClick={() => {
                      setSearchQuery(tag)
                      handleSearchChange(tag)
                    }}
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