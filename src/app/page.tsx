"use client"

import { useState } from "react"
import Link from "next/link"

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
    <div className="flex min-h-screen flex-col">
      {/* Header - Minimalist Navigation */}
      <header className="py-6 border-b border-brand-sand bg-brand-cream">
        <div className="container flex items-center justify-between">
          <div className="font-semibold tracking-tight text-xl text-brand-brown">MENFEM</div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-sm text-brand-brown hover:text-brand-rust transition-colors">Agents</Link>
            <Link href="#" className="text-sm text-brand-brown hover:text-brand-rust transition-colors">Business Models</Link>
            <Link href="#" className="text-sm text-brand-brown hover:text-brand-rust transition-colors">Standards & Protocols</Link>
            <Link href="#" className="text-sm text-brand-brown hover:text-brand-rust transition-colors">Products</Link>
            <Link href="#" className="text-sm text-brand-brown hover:text-brand-rust transition-colors">Infrastructure</Link>
            <Link href="#" className="text-sm text-brand-brown hover:text-brand-rust transition-colors">About</Link>
          </div>

          <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
            <span className="sr-only">Menu</span>
            <div className="h-1 w-5 bg-brand-brown mb-1"></div>
            <div className="h-1 w-5 bg-brand-brown"></div>
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="max-w-[800px]">
          <h1 className="text-5xl md:text-7xl font-normal tracking-tight leading-[1.1] text-brand-brown">
            Brand.
            <br />
            Digital.
            <br />
            <span className="italic text-brand-terracotta">Aligned.</span>
          </h1>
          <p className="mt-8 text-xl text-brand-rust max-w-[600px]">
            Crafting memorable brand experiences with thoughtful design and strategic storytelling.
          </p>
        </div>
      </section>

      {/* Divider Line */}
      <div className="border-t border-brand-sand w-full"></div>

      {/* Brand Colors Showcase */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-xl font-normal mb-12">Our Brand Colors</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="flex flex-col gap-3">
              <div className="h-32 bg-brand-brown rounded-md flex items-end p-3">
                <span className="text-white text-xs font-mono">#71513C</span>
              </div>
              <div className="text-sm">Brown</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-32 bg-brand-terracotta rounded-md flex items-end p-3">
                <span className="text-white text-xs font-mono">#D4927D</span>
              </div>
              <div className="text-sm">Terracotta</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-32 bg-brand-sand rounded-md flex items-end p-3">
                <span className="text-brand-brown text-xs font-mono">#ECD5B3</span>
              </div>
              <div className="text-sm">Sand</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-32 bg-brand-cream rounded-md flex items-end p-3">
                <span className="text-brand-brown text-xs font-mono">#EBE5D0</span>
              </div>
              <div className="text-sm">Cream</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-32 bg-brand-sage rounded-md flex items-end p-3">
                <span className="text-brand-brown text-xs font-mono">#B5C8C6</span>
              </div>
              <div className="text-sm">Sage</div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-32 bg-brand-rust rounded-md flex items-end p-3">
                <span className="text-white text-xs font-mono">#8C5945</span>
              </div>
              <div className="text-sm">Rust</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Disciplines Section */}
      <section className="py-16 md:py-24 bg-brand-cream">
        <div className="container">
          <h2 className="text-xl font-normal mb-16 text-brand-brown">Our Disciplines</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Concentric Circles - Visual Element */}
            <div className="absolute hidden md:block left-16 top-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="h-[400px] w-[400px] border border-brand-sand rounded-full"></div>
                <div className="h-[280px] w-[280px] border border-brand-sand rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="h-[160px] w-[160px] border border-brand-sand rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="absolute left-0 top-0 h-full">
                <div className="h-full w-[2px] bg-brand-terracotta"></div>
                <div className="flex flex-col items-center gap-1 absolute top-1/3 -left-1">
                  <div className="w-[2px] h-[2px] rounded-full bg-brand-rust"></div>
                  <div className="w-[2px] h-[2px] rounded-full bg-brand-rust mt-1"></div>
                </div>
              </div>
            </div>

            {/* Disciplines Content */}
            <div className="col-span-1 md:col-span-2 md:col-start-2">
              <div className="space-y-16">
                {DISCIPLINES.map((discipline, index) => (
                  <div key={index} className={cn(
                    "pb-16 border-b border-brand-sand last:border-0 last:pb-0",
                    index === activeDiscipline ? "opacity-100" : "opacity-70 hover:opacity-100 transition-opacity"
                  )}
                  onMouseEnter={() => setActiveDiscipline(index)}
                  >
                    <h3 className="text-3xl font-normal mb-6 text-brand-rust">{discipline.title}</h3>
                    <p className="text-lg mb-8 max-w-[600px] text-brand-brown">{discipline.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {discipline.services.map((service, i) => (
                        <div key={i} className="text-sm text-brand-brown">{service}</div>
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
      <footer className="py-8 border-t border-brand-sand mt-auto bg-brand-sage">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-1">
              <p className="text-sm text-brand-brown font-medium">MENFEM</p>
              <p className="text-sm text-brand-brown">© {new Date().getFullYear()} All rights reserved.</p>
            </div>

            <div className="flex gap-10">
              <div className="space-y-4">
                <p className="text-sm font-medium text-brand-brown">Contact</p>
                <div className="space-y-2">
                  <p className="text-sm text-brand-brown hover:text-brand-rust transition-colors">
                    <a href="mailto:hello@menfem.com">hello@menfem.com</a>
                  </p>
                  <p className="text-sm text-brand-brown hover:text-brand-rust transition-colors">
                    <a href="tel:+44000000000">+44 000 000 000</a>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-brand-brown">Social</p>
                <div className="space-y-2">
                  <p className="text-sm text-brand-brown hover:text-brand-rust transition-colors">
                    <a href="#">Instagram</a>
                  </p>
                  <p className="text-sm text-brand-brown hover:text-brand-rust transition-colors">
                    <a href="#">LinkedIn</a>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-brand-brown">Legal</p>
                <div className="space-y-2">
                  <p className="text-sm text-brand-brown hover:text-brand-rust transition-colors">
                    <a href="#">Privacy</a>
                  </p>
                  <p className="text-sm text-brand-brown hover:text-brand-rust transition-colors">
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