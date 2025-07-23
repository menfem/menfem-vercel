// ABOUTME: Navigation component with dropdown menus inspired by Service95 design
// ABOUTME: Features logo, category dropdowns, search and newsletter buttons

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SearchModal } from "@/components/search-modal"

const CATEGORIES = [
  {
    name: "CULTURE",
    subcategories: [
      { name: "Film & TV", href: "/culture/film-tv" },
      { name: "Music", href: "/culture/music" },
      { name: "Art", href: "/culture/art" },
      { name: "Books", href: "/culture/books" },
      { name: "Photography", href: "/culture/photography" }
    ]
  },
  {
    name: "STYLE",
    subcategories: [
      { name: "Fashion", href: "/style/fashion" },
      { name: "Grooming", href: "/style/grooming" },
      { name: "Watches", href: "/style/watches" },
      { name: "Lifestyle", href: "/style/lifestyle" }
    ]
  },
  {
    name: "TECH",
    subcategories: [
      { name: "Gadgets", href: "/tech/gadgets" },
      { name: "Apps", href: "/tech/apps" },
      { name: "AI & Innovation", href: "/tech/ai-innovation" },
      { name: "Gaming", href: "/tech/gaming" }
    ]
  },
  {
    name: "FITNESS",
    subcategories: [
      { name: "Workouts", href: "/fitness/workouts" },
      { name: "Nutrition", href: "/fitness/nutrition" },
      { name: "Mental Health", href: "/fitness/mental-health" },
      { name: "Sports", href: "/fitness/sports" }
    ]
  },
  {
    name: "FINANCE",
    subcategories: [
      { name: "Investing", href: "/finance/investing" },
      { name: "Crypto", href: "/finance/crypto" },
      { name: "Personal Finance", href: "/finance/personal-finance" },
      { name: "Business", href: "/finance/business" }
    ]
  },
  {
    name: "THE LIST",
    href: "/the-list"
  },
  {
    name: "MENFEM CLUB",
    href: "/club"
  }
]

export function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl tracking-tight">
            MENFEM
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {CATEGORIES.map((category, index) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {category.href ? (
                  <Link
                    href={category.href}
                    className="text-sm font-medium tracking-wide hover:text-brand-terracotta transition-colors"
                  >
                    {category.name}
                  </Link>
                ) : (
                  <button className="text-sm font-medium tracking-wide hover:text-brand-terracotta transition-colors">
                    {category.name}
                  </button>
                )}
                
                {category.subcategories && activeDropdown === index && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg">
                    <div className="py-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block px-4 py-2 text-sm hover:bg-brand-cream hover:text-brand-terracotta transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden lg:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button 
              className="hidden lg:flex bg-brand-terracotta hover:bg-brand-rust text-white"
              size="sm"
            >
              NEWSLETTER
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="space-y-1">
                <div className="h-0.5 w-5 bg-current"></div>
                <div className="h-0.5 w-5 bg-current"></div>
                <div className="h-0.5 w-5 bg-current"></div>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="py-2">
                {category.href ? (
                  <Link
                    href={category.href}
                    className="block text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ) : (
                  <>
                    <div className="text-sm font-medium py-2">{category.name}</div>
                    {category.subcategories && (
                      <div className="pl-4 space-y-1">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block text-sm py-1 text-gray-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <Button 
              className="w-full mt-4 bg-brand-terracotta hover:bg-brand-rust text-white"
              size="sm"
            >
              NEWSLETTER
            </Button>
          </div>
        )}
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}