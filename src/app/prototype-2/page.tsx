"use client"

import { Bot, CreditCard, GlobeIcon, Headphones, Hotel, LayoutGrid, Search, ShoppingBag, Star } from "lucide-react"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample data for featured categories
const CATEGORIES = [
  { name: "Fashion", icon: <ShoppingBag className="h-5 w-5" /> },
  { name: "Technology", icon: <Headphones className="h-5 w-5" /> },
  { name: "Hotels", icon: <Hotel className="h-5 w-5" /> },
  { name: "Services", icon: <CreditCard className="h-5 w-5" /> },
  { name: "AI", icon: <Bot className="h-5 w-5" /> },
  { name: "Explore", icon: <LayoutGrid className="h-5 w-5" /> }
]

// Sample featured collections
const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: "London Luxury Hotels",
    itemCount: 12,
    image: "/placeholder-collection.jpg",
    curator: "Connor Royes",
    description: "The finest hotels in London, known for exceptional service and distinctive experiences."
  },
  {
    id: 2,
    title: "Premium Audio Equipment",
    itemCount: 24,
    image: "/placeholder-collection.jpg",
    curator: "Connor Royes",
    description: "Curated selection of high-end audio equipment for the discerning listener."
  },
  {
    id: 3,
    title: "Artisanal Home Goods",
    itemCount: 18,
    image: "/placeholder-collection.jpg",
    curator: "Connor Royes",
    description: "Hand-selected home goods from master craftspeople around the world."
  }
]

// Sample featured services
const FEATURED_SERVICES = [
  {
    id: 1,
    name: "AI-Powered Shopping Assistant",
    description: "Let our AI find the perfect products based on your preferences and style.",
    category: "Technology",
    price: "£19.99/month"
  },
  {
    id: 2,
    name: "Personal Concierge Service",
    description: "Exclusive access to our concierge network for travel, dining, and events.",
    category: "Luxury",
    price: "£99.99/month"
  },
  {
    id: 3,
    name: "Brand Consulting",
    description: "Strategic consulting to align your brand with evolving consumer preferences.",
    category: "Business",
    price: "Custom pricing"
  }
]

export default function PrototypeTwo() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">MENFEM</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {CATEGORIES.map((category) => (
              <Link 
                key={category.name}
                href="#"
                className="text-sm font-medium flex items-center gap-1.5 text-neutral-600 hover:text-black"
              >
                {category.icon}
                {category.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-200 to-neutral-50 -z-10" />
        
        <div className="container relative z-10">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              The Future of <span className="text-blue-600">Taste-Driven</span> Commerce
            </h1>
            <p className="text-xl text-neutral-600 max-w-[600px] mx-auto">
              MENFEM connects trusted brands and exceptional products with AI assistants
              and discerning consumers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full">Explore Collections</Button>
              <Button size="lg" variant="outline" className="rounded-full">Connect Your LLM</Button>
            </div>
            
            <div className="pt-8 text-neutral-500 text-sm">
              <p>Trusted by 1,000+ brands and AI platforms</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Collections Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-blue-600 font-medium mb-1">Curated Excellence</div>
              <h2 className="text-3xl font-bold">Featured Collections</h2>
            </div>
            <Link href="#" className={cn(buttonVariants({ variant: "ghost" }), "gap-1")}>
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COLLECTIONS.map((collection) => (
              <div key={collection.id} className="group relative">
                <div className="aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden">
                  {/* Placeholder for collection image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LayoutGrid className="h-16 w-16 text-neutral-300" />
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-1 text-white/80 text-sm mb-1">
                    <span>{collection.itemCount} items</span>
                    <span>•</span>
                    <span>Curated by {collection.curator}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{collection.title}</h3>
                  <p className="text-sm text-white/90 line-clamp-2">{collection.description}</p>
                </div>
                
                <Link href="#" className="absolute inset-0" aria-label={`View ${collection.title} collection`}>
                  <span className="sr-only">View collection</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-neutral-50 border-y">
        <div className="container">
          <div className="max-w-[600px] mx-auto text-center mb-12">
            <div className="text-blue-600 font-medium mb-1">Premium Offerings</div>
            <h2 className="text-3xl font-bold mb-4">MENFEM Services</h2>
            <p className="text-neutral-600">
              Access our expert services designed to enhance your brand experience and
              connect you with the future of AI-driven commerce.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_SERVICES.map((service) => (
              <Card key={service.id} className="border-none shadow-lg">
                <CardHeader>
                  <div className="text-sm text-blue-600 mb-1">{service.category}</div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <div className="font-medium">{service.price}</div>
                  <Button size="sm">Learn More</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* LLM Integration Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                <Bot className="mr-1 h-4 w-4" />
                AI Integration
              </div>
              
              <h2 className="text-4xl font-bold tracking-tight">
                Connect Your Favorite AI Assistant
              </h2>
              
              <p className="text-lg text-neutral-600">
                MENFEM serves as a trusted data source for your AI, enabling it to recommend
                and book products and services that match your taste preferences.
              </p>
              
              <ul className="space-y-2">
                {[
                  "Integrate with leading LLM platforms",
                  "Personalized recommendations based on your taste profile",
                  "Secure booking and transaction handling",
                  "Access to exclusive curated collections"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <Button size="lg">Connect Your LLM</Button>
              </div>
            </div>
            
            <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden">
              {/* Placeholder for illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot className="h-20 w-20 text-neutral-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Brand Experience?
            </h2>
            <p className="text-xl text-blue-100">
              Join MENFEM and be part of the future of commerce, connecting exceptional
              products with discerning consumers through AI integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-blue-600">
                Join as a Brand
              </Button>
              <Button size="lg" variant="outline" className="border-blue-400 text-white hover:bg-blue-500">
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-neutral-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-6 w-6" />
                <span className="text-lg font-bold">MENFEM</span>
              </div>
              <p className="text-sm text-neutral-400">
                The premier platform for taste-driven commerce and AI integration.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-neutral-200">Solutions</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-neutral-400 hover:text-white">For Brands</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">For AI Partners</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">For Consumers</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">API Access</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-neutral-200">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-neutral-400 hover:text-white">About Us</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">Careers</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">Press</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-neutral-200">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-neutral-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-neutral-500">
              © {new Date().getFullYear()} MENFEM. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              
              <Link href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              
              <Link href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}