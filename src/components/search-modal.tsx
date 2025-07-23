// ABOUTME: Search modal component with full-screen overlay and search functionality
// ABOUTME: Appears when search button is clicked in navigation

"use client"

import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center border-b-2 border-gray-300 pb-4">
            <Search className="h-6 w-6 text-gray-400 mr-4" />
            <input
              type="text"
              placeholder="Search Menfem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-2xl md:text-3xl outline-none placeholder-gray-400"
              autoFocus
            />
          </div>

          {searchQuery && (
            <div className="mt-8">
              <p className="text-gray-500 mb-4">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {["Style", "Tech", "Fitness", "Culture", "Finance"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-brand-cream hover:bg-brand-sand rounded-full text-sm transition-colors"
                    onClick={() => setSearchQuery(tag)}
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