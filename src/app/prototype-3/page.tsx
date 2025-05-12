"use client"

import { Bot, Command, Globe, GlobeIcon, MessageSquare, PanelLeft, Search, ShoppingBag, Star, UserCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample trending products
const TRENDING_PRODUCTS = [
  {
    id: 1,
    name: "Leica Q3",
    category: "Photography",
    description: "Full-frame compact camera with a 60MP sensor and fixed Summilux 28mm f/1.7 lens.",
    price: "£5,300",
    rating: 4.9,
    image: "/placeholder-product.jpg",
    featured: true
  },
  {
    id: 2,
    name: "Loro Piana Open Walk",
    category: "Fashion",
    description: "Handcrafted suede loafers with natural rubber soles and exceptional comfort.",
    price: "£650",
    rating: 4.8,
    image: "/placeholder-product.jpg",
    featured: false
  },
  {
    id: 3,
    name: "Apple Vision Pro",
    category: "Technology",
    description: "Mixed reality headset with advanced spatial computing capabilities.",
    price: "£3,499",
    rating: 4.7,
    image: "/placeholder-product.jpg",
    featured: true
  },
  {
    id: 4,
    name: "The Connaught Suite",
    category: "Luxury Hotels",
    description: "Signature suite at The Connaught, featuring bespoke furnishings and exceptional service.",
    price: "£2,500/night",
    rating: 4.9,
    image: "/placeholder-product.jpg",
    featured: false
  }
]

// Sample brand categories
const BRAND_CATEGORIES = [
  "Technology",
  "Fashion",
  "Hotels",
  "Dining",
  "Home",
  "Wellness",
  "Travel",
  "Business"
]

// Sample integrations
const INTEGRATIONS = [
  { name: "Claude", logo: <Bot className="h-5 w-5" /> },
  { name: "ChatGPT", logo: <MessageSquare className="h-5 w-5" /> },
  { name: "Custom API", logo: <Globe className="h-5 w-5" /> }
]

export default function PrototypeThree() {
  const [activeTab, setActiveTab] = useState("For Brands")
  
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <GlobeIcon className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">MENFEM</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#" className="text-sm text-white/80 hover:text-white">Products</Link>
            <Link href="#" className="text-sm text-white/80 hover:text-white">Collections</Link>
            <Link href="#" className="text-sm text-white/80 hover:text-white">Services</Link>
            <Link href="#" className="text-sm text-white/80 hover:text-white">API</Link>
            <Link href="#" className="text-sm text-white/80 hover:text-white">About</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
              <UserCircle2 className="h-5 w-5" />
            </Button>
            <Button className="bg-white text-black hover:bg-white/90">Connect</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 container">
        <div className="max-w-[800px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-sm">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            AI-Powered Taste Database
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Redefining Commerce Through <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-600">Curated Taste</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-[600px] mx-auto">
            MENFEM connects exceptional brands and products with AI assistants,
            becoming the trusted source for taste-driven commerce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Explore Platform
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
              Connect Your LLM
            </Button>
          </div>
          
          <div className="pt-12 flex items-center justify-center gap-8 text-white/60">
            <p className="text-sm">Compatible with:</p>
            {INTEGRATIONS.map((integration) => (
              <div key={integration.name} className="flex items-center gap-1.5">
                {integration.logo}
                <span className="text-sm">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending Products Section */}
      <section className="py-16 border-t border-white/10 bg-zinc-950">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link href="#" className={cn(buttonVariants({ variant: "ghost" }), "gap-1 text-white/80 hover:text-white")}>
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRENDING_PRODUCTS.map((product) => (
              <Card key={product.id} className={cn(
                "bg-zinc-900 border-zinc-800 text-white overflow-hidden transition-all duration-300 hover:border-white/20",
                product.featured ? "lg:col-span-2" : ""
              )}>
                <div className={cn(
                  "aspect-video w-full bg-zinc-800 relative",
                  product.featured ? "aspect-[16/9]" : "aspect-square"
                )}>
                  {/* Placeholder for product image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-zinc-700" />
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/60">{product.category}</div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  {product.featured && (
                    <CardDescription className="text-white/70">{product.description}</CardDescription>
                  )}
                </CardHeader>
                
                <CardFooter className="justify-between">
                  <div className="font-medium">{product.price}</div>
                  <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/10">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Platform Features Section */}
      <section className="py-20 container">
        <div className="mb-12 flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-between">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The Future of <br />Taste-Driven Commerce
            </h2>
            
            <p className="text-lg text-white/80">
              MENFEM provides a comprehensive platform that bridges the gap between exceptional brands,
              discerning consumers, and AI assistants.
            </p>
          </div>
          
          <div className="flex-1 flex justify-end">
            <div className="bg-zinc-900 p-2 rounded-xl border border-white/10 inline-flex">
              {["For Brands", "For Consumers", "For AI Partners"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === tab 
                      ? "bg-white text-black" 
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTab === "For Brands" && (
            <>
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>Global Visibility</CardTitle>
                  <CardDescription className="text-white/70">
                    Expand your brand's reach through integration with leading AI platforms
                    and access to discerning consumers.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                    <PanelLeft className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle>Brand Control</CardTitle>
                  <CardDescription className="text-white/70">
                    Maintain full control over how your products and services are presented
                    and recommended by AI assistants.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <Command className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle>Data Insights</CardTitle>
                  <CardDescription className="text-white/70">
                    Gain valuable data on how consumers engage with your brand through
                    AI interactions and direct platform usage.
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
          
          {activeTab === "For Consumers" && (
            <>
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Star className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>Curated Excellence</CardTitle>
                  <CardDescription className="text-white/70">
                    Access a handpicked selection of the finest products, services, and experiences
                    that match your taste profile.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                    <Bot className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle>AI-Powered Discovery</CardTitle>
                  <CardDescription className="text-white/70">
                    Let your preferred AI assistant recommend products and services from
                    MENFEM's trusted database.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle>Seamless Transactions</CardTitle>
                  <CardDescription className="text-white/70">
                    Complete purchases and bookings directly through your AI assistant
                    with secure payment processing.
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
          
          {activeTab === "For AI Partners" && (
            <>
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>Trusted Data Source</CardTitle>
                  <CardDescription className="text-white/70">
                    Access a verified database of premium products and services to recommend
                    to your users with confidence.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                    <Command className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle>API Integration</CardTitle>
                  <CardDescription className="text-white/70">
                    Easily integrate MENFEM's capabilities into your AI platform through
                    our comprehensive API.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle>Revenue Sharing</CardTitle>
                  <CardDescription className="text-white/70">
                    Monetize transactions facilitated through your platform with our
                    competitive revenue-sharing model.
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
        </div>
      </section>
      
      {/* Brand Categories Section */}
      <section className="py-16 border-t border-white/10 bg-zinc-950">
        <div className="container">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">Explore Brand Categories</h2>
            <p className="text-white/70 max-w-[600px] mx-auto">
              Discover exceptional brands across multiple categories, all vetted for quality and distinctiveness.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BRAND_CATEGORIES.map((category) => (
              <Link 
                key={category}
                href="#"
                className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800 transition-all duration-300 hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="font-medium text-lg relative z-10">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/40 to-violet-900/40 border-y border-white/10">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Connect Your Brand or AI Assistant Today
            </h2>
            <p className="text-xl text-white/80">
              Join MENFEM and become part of the future of taste-driven commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Apply as a Brand Partner
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                Explore API Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                  <GlobeIcon className="h-5 w-5 text-black" />
                </div>
                <span className="text-xl font-bold">MENFEM</span>
              </div>
              <p className="text-sm text-white/60">
                Redefining commerce through curated taste and AI integration.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-white/80">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-white/60 hover:text-white">For Brands</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">For Consumers</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">For AI Partners</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">API Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-white/80">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-white/60 hover:text-white">About</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">Team</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">Careers</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-white/80">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-white/60 hover:text-white">Terms</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">Cookies</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-white">Licensing</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/60">
              © {new Date().getFullYear()} MENFEM. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="#" className="text-white/60 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              
              <Link href="#" className="text-white/60 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              
              <Link href="#" className="text-white/60 hover:text-white">
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