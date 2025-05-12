"use client"

import { GlobeIcon, ListFilter, Search, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for curated products
const CURATED_PRODUCTS = [
  {
    id: 1,
    name: "Aesop Resurrection Hand Wash",
    category: "Personal Care",
    price: "$39",
    image: "/placeholder-product.jpg",
    rating: 4.9,
    description: "A gentle formulation that cleanses thoroughly without drying the skin."
  },
  {
    id: 2,
    name: "B&O Beoplay H95",
    category: "Technology",
    price: "$899",
    image: "/placeholder-product.jpg",
    rating: 4.8,
    description: "Premium noise cancelling headphones with exceptional sound quality."
  },
  {
    id: 3,
    name: "Hasselblad X2D 100C",
    category: "Photography",
    price: "$8,199",
    image: "/placeholder-product.jpg",
    rating: 4.9,
    description: "Medium format mirrorless camera system with unparalleled image quality."
  }
]

// Sample data for featured hotels
const FEATURED_HOTELS = [
  {
    id: 1,
    name: "The Connaught",
    location: "Mayfair, London",
    price: "£750/night",
    image: "/placeholder-hotel.jpg",
    rating: 4.9,
    description: "Luxury hotel with Michelin-starred dining and exceptional service."
  },
  {
    id: 2,
    name: "Claridge's",
    location: "Mayfair, London",
    price: "£695/night",
    image: "/placeholder-hotel.jpg",
    rating: 4.8,
    description: "Art Deco landmark offering timeless luxury in the heart of Mayfair."
  }
]

export default function PrototypeOne() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-8 w-8" />
            <span className="text-xl font-bold">MENFEM</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost">Collections</Button>
            <Button variant="ghost">Hotels</Button>
            <Button variant="ghost">Services</Button>
            <Button variant="ghost">Experiences</Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button>Connect My LLM</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container py-24 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Curated Excellence for <br />Discerning Taste
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            MENFEM connects you to exceptional brands, products, and experiences.
            Powering the next generation of commerce through taste-driven AI integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button size="lg">Browse Collections</Button>
            <Button size="lg" variant="outline">Connect Your AI</Button>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="container py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Curated Products</h2>
            <p className="text-muted-foreground">Expert selections for the discerning consumer.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CURATED_PRODUCTS.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted relative">
                {/* Placeholder for product image */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <ShoppingBag className="h-10 w-10 text-neutral-400" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{product.category}</div>
                  <div className="text-sm font-medium">{product.price}</div>
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <div className="text-sm text-muted-foreground">Rating: {product.rating}/5</div>
                <Button size="sm">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Featured Hotels */}
      <section className="container py-12 space-y-6 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">London's Finest Hotels</h2>
            <p className="text-muted-foreground">Luxury accommodations curated for exceptional experiences.</p>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_HOTELS.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted relative">
                {/* Placeholder for hotel image */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <GlobeIcon className="h-10 w-10 text-neutral-400" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{hotel.location}</div>
                  <div className="text-sm font-medium">{hotel.price}</div>
                </div>
                <CardTitle>{hotel.name}</CardTitle>
                <CardDescription>{hotel.description}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <div className="text-sm text-muted-foreground">Rating: {hotel.rating}/5</div>
                <Button size="sm">Book via LLM</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* AI Integration Section */}
      <section className="container py-20 space-y-6">
        <div className="mx-auto max-w-[900px] text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Powering the Future of Commerce</h2>
          <p className="text-lg text-muted-foreground">
            MENFEM integrates with your favorite AI assistants, allowing them to source exceptional products
            and services based on your taste preferences and our curated selections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button size="lg">Connect Your LLM</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 mt-auto">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GlobeIcon className="h-6 w-6" />
              <span className="text-lg font-bold">MENFEM</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Curating excellence in products, services, and experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Technology</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Fashion</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Travel</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">API</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Partners</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Licenses</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Settings</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="container mt-8 pt-8 border-t">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MENFEM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}