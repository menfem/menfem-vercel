// ABOUTME: Homepage component with Service95-inspired design featuring articles and content grid
// ABOUTME: Includes featured article hero, editor's picks, latest articles, and newsletter signup

import { Navigation } from "@/components/navigation"
import { FeaturedArticle } from "@/components/featured-article"
import { ArticleCard } from "@/components/article-card"
import { NewsletterSignup } from "@/components/newsletter-signup"
import Link from "next/link"

// Mock data - replace with actual data fetching
const FEATURED_ARTICLE = {
  title: "The Rise of AI-Powered Personal Style: How Technology is Reshaping Men's Fashion",
  category: "Tech & Style",
  excerpt: "From virtual try-ons to AI stylists, discover how cutting-edge technology is revolutionizing the way men approach fashion and personal style.",
  imageUrl: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&h=900&fit=crop",
  href: "/articles/ai-powered-personal-style",
  author: "Connor Royes",
  readTime: "8 min"
}

const EDITORS_FAVOURITES = [
  {
    title: "Inside London's Underground Supper Club Scene",
    category: "Culture",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop",
    href: "/articles/london-supper-clubs",
    author: "James Chen",
    date: "July 20, 2025"
  },
  {
    title: "The New Wave of Men's Wellness Retreats",
    category: "Fitness",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=450&fit=crop",
    href: "/articles/mens-wellness-retreats",
    author: "Michael Torres",
    date: "July 18, 2025"
  },
  {
    title: "Crypto Art Collecting: A Beginner's Guide",
    category: "Finance",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    href: "/articles/crypto-art-guide",
    author: "Alex Kim",
    date: "July 15, 2025"
  }
]

const LATEST_ARTICLES = [
  {
    title: "The Best Coffee Shops for Remote Work in Major Cities",
    category: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=450&fit=crop",
    href: "/articles/remote-work-coffee-shops"
  },
  {
    title: "Essential Gadgets for the Modern Professional",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=450&fit=crop",
    href: "/articles/essential-gadgets-2025"
  },
  {
    title: "Mastering the Art of the Power Nap",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&h=450&fit=crop",
    href: "/articles/power-nap-guide"
  },
  {
    title: "Sustainable Fashion Brands Every Man Should Know",
    category: "Style",
    imageUrl: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&h=450&fit=crop",
    href: "/articles/sustainable-fashion-brands"
  },
  {
    title: "The Psychology of High Performance",
    category: "Personal Development",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=450&fit=crop",
    href: "/articles/high-performance-psychology"
  },
  {
    title: "Investment Strategies for Your 30s",
    category: "Finance",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    href: "/articles/investment-strategies-30s"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <Navigation />
      
      {/* Featured Article */}
      <section className="container mx-auto px-4 py-8">
        <FeaturedArticle {...FEATURED_ARTICLE} />
      </section>

      {/* Editor's Favourites */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Editor's Favourites</h2>
          <Link 
            href="/editors-favourites" 
            className="text-brand-terracotta hover:text-brand-rust transition-colors text-sm font-medium uppercase tracking-wide"
          >
            See All Stories
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EDITORS_FAVOURITES.map((article) => (
            <ArticleCard key={article.href} {...article} />
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* The Latest */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">The Latest</h2>
          <Link 
            href="/latest" 
            className="text-brand-terracotta hover:text-brand-rust transition-colors text-sm font-medium uppercase tracking-wide"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LATEST_ARTICLES.map((article) => (
            <ArticleCard key={article.href} {...article} size="small" />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">MENFEM</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Your cultural concierge for modern men's lifestyle. Curated content on culture, 
                style, tech, fitness, and finance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">YouTube</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/advertise" className="hover:text-white transition-colors">Advertise</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Menfem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}