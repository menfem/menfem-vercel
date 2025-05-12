"use client"

import { useState } from "react"
import Link from "next/link"
import { Circle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Disciplines data
const DISCIPLINES = [
  {
    title: "Strategy",
    description: "Good design starts with clarity of purpose. We find the why and put it at the center of our work, to build brands that know what they stand for.",
    services: [
      "Workshops",
      "Research",
      "Brand Purpose",
      "Frameworks",
      "Narratives",
      "Positioning"
    ]
  },
  {
    title: "Identity",
    description: "Distinctive visual systems that express your brand's personality across all touchpoints, creating a cohesive and memorable experience.",
    services: [
      "Logo Design",
      "Visual Systems",
      "Typography",
      "Art Direction",
      "Brand Guidelines",
      "Custom Icons"
    ]
  },
  {
    title: "Digital",
    description: "Thoughtful digital experiences that engage users and communicate your brand values through intuitive, purposeful interfaces.",
    services: [
      "Web Design",
      "UX Strategy",
      "Mobile Applications",
      "Interaction Design",
      "Digital Products",
      "Prototyping"
    ]
  }
]

export default function Home() {
  const [activeDiscipline, setActiveDiscipline] = useState(0)
  
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Header - Minimalist Navigation */}
      <header className="py-6 border-b border-neutral-200">
        <div className="container flex items-center justify-between">
          <div className="font-semibold tracking-tight text-xl">MENFEM</div>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link href="#" className="text-sm hover:underline">Studio</Link>
            <Link href="#" className="text-sm hover:underline">Work</Link>
            <Link href="#" className="text-sm hover:underline">About</Link>
            <Link href="#" className="text-sm hover:underline">Contact</Link>
          </div>
          
          <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
            <span className="sr-only">Menu</span>
            <div className="h-1 w-5 bg-black mb-1"></div>
            <div className="h-1 w-5 bg-black"></div>
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="max-w-[800px]">
          <h1 className="text-5xl md:text-7xl font-normal tracking-tight leading-[1.1]">
            Brand.
            <br />
            Digital.
            <br />
            <span className="italic">Aligned.</span>
          </h1>
        </div>
      </section>
      
      {/* Divider Line */}
      <div className="border-t border-neutral-200 w-full"></div>
      
      {/* Our Disciplines Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-xl font-normal mb-16">Our Disciplines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Concentric Circles - Visual Element */}
            <div className="absolute hidden md:block left-16 top-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="h-[400px] w-[400px] border border-neutral-300 rounded-full"></div>
                <div className="h-[280px] w-[280px] border border-neutral-300 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="h-[160px] w-[160px] border border-neutral-300 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              <div className="absolute left-0 top-0 h-full">
                <div className="h-full w-[2px] bg-neutral-400"></div>
                <div className="flex flex-col items-center gap-1 absolute top-1/3 -left-1">
                  <div className="w-[2px] h-[2px] rounded-full bg-neutral-900"></div>
                  <div className="w-[2px] h-[2px] rounded-full bg-neutral-900 mt-1"></div>
                </div>
              </div>
            </div>
            
            {/* Disciplines Content */}
            <div className="col-span-1 md:col-span-2 md:col-start-2">
              <div className="space-y-16">
                {DISCIPLINES.map((discipline, index) => (
                  <div key={index} className={cn(
                    "pb-16 border-b border-neutral-200 last:border-0 last:pb-0",
                    index === activeDiscipline ? "opacity-100" : "opacity-70 hover:opacity-100 transition-opacity"
                  )}
                  onMouseEnter={() => setActiveDiscipline(index)}
                  >
                    <h3 className="text-3xl font-normal mb-6">{discipline.title}</h3>
                    <p className="text-lg mb-8 max-w-[600px]">{discipline.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {discipline.services.map((service, i) => (
                        <div key={i} className="text-sm text-neutral-500">{service}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-1">
              <p className="text-sm">MENFEM</p>
              <p className="text-sm text-neutral-500">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            
            <div className="flex gap-10">
              <div className="space-y-4">
                <p className="text-sm font-medium">Contact</p>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500 hover:text-black transition-colors">
                    <a href="mailto:hello@menfem.com">hello@menfem.com</a>
                  </p>
                  <p className="text-sm text-neutral-500 hover:text-black transition-colors">
                    <a href="tel:+44000000000">+44 000 000 000</a>
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-medium">Social</p>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500 hover:text-black transition-colors">
                    <a href="#">Instagram</a>
                  </p>
                  <p className="text-sm text-neutral-500 hover:text-black transition-colors">
                    <a href="#">LinkedIn</a>
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-medium">Legal</p>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-500 hover:text-black transition-colors">
                    <a href="#">Privacy</a>
                  </p>
                  <p className="text-sm text-neutral-500 hover:text-black transition-colors">
                    <a href="#">Terms</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}