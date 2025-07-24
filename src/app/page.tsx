// ABOUTME: Homepage with about section, rotating hero image, and weekly reading recommendation
// ABOUTME: Inspired by Service95's clean, editorial design approach

import { Navigation } from "@/components/navigation"
import { RotatingHeroImage } from "@/components/rotating-hero-image"
import { ReadingRecommendation } from "@/components/reading-recommendation"
import { NewsletterSignup } from "@/components/newsletter-signup"
import Link from "next/link"

// Weekly reading recommendation data
const WEEKLY_READING = {
  bookTitle: "The Will to Change",
  author: "bell hooks",
  coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
  description: "A groundbreaking exploration of how patriarchy impacts men's emotional lives and relationships. bell hooks offers a compassionate yet unflinching look at how men can transform themselves and society by embracing emotional awareness and rejecting toxic masculinity. Essential reading for understanding modern masculinity.",
  ctaUrl: "/reading/will-to-change"
}

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-sage">
      <Navigation />
      
      {/* Hero Section with About */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-brown leading-tight">
              Welcome to MenFem
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              MenFem is your cultural concierge for modern men's lifestyle, curating the best in culture, arts, style, and personal development.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              In an era of AI-generated content overload, we're committed to being a trusted filter – a human-curated beacon that helps you discover what's truly worth your time. From thought-provoking reads to style insights, from cultural commentary to personal growth, we're here to elevate your everyday.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is simple: to build a community of thoughtful, curious men who are redefining what modern masculinity means. Through carefully selected content, exclusive events, and meaningful conversations, we're creating a space where excellence meets authenticity.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/about"
                className="bg-brand-brown hover:bg-brand-rust text-white font-medium py-3 px-6 transition-colors"
              >
                Learn More About Us
              </Link>
              <Link 
                href="/membership"
                className="border-2 border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white font-medium py-3 px-6 transition-all"
              >
                Join MenFem Club
              </Link>
            </div>
          </div>
          
          {/* Rotating Hero Image */}
          <div className="order-first lg:order-last">
            <RotatingHeroImage />
          </div>
        </div>
      </section>

      {/* This Week's Reading Recommendation */}
      <ReadingRecommendation {...WEEKLY_READING} />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Quick Links Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-brand-brown">Explore MenFem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link href="/culture" className="group">
            <div className="bg-white p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-brand-brown group-hover:text-brand-terracotta transition-colors">
                Culture & Arts
              </h3>
              <p className="text-gray-600">
                Film, music, literature, and cultural commentary for the modern man.
              </p>
            </div>
          </Link>
          
          <Link href="/style" className="group">
            <div className="bg-white p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-brand-brown group-hover:text-brand-terracotta transition-colors">
                Style & Living
              </h3>
              <p className="text-gray-600">
                Elevate your personal style and lifestyle with curated insights.
              </p>
            </div>
          </Link>
          
          <Link href="/the-list" className="group">
            <div className="bg-white p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-brand-brown group-hover:text-brand-terracotta transition-colors">
                The List
              </h3>
              <p className="text-gray-600">
                Weekly curated recommendations of what's worth your attention.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">MENFEM</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                A cultural concierge for the modern man. Curating excellence in lifestyle, culture, and personal development.
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
            <p>&copy; {new Date().getFullYear()} MenFem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}