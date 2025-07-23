// ABOUTME: Newsletter signup component for homepage with email input and subscription
// ABOUTME: Styled to match Service95 aesthetic with prominent call-to-action

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    
    // TODO: Implement actual newsletter signup
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 3000)
    }, 1000)
  }

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Menfem Newsletter
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get weekly curated content on culture, style, tech, and more. 
            Insider recommendations delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-brand-sand rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent bg-white"
              disabled={status === "loading"}
            />
            <Button 
              type="submit"
              disabled={status === "loading"}
              className="bg-brand-terracotta hover:bg-brand-rust text-white px-6 py-3"
            >
              {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </Button>
          </form>
          
          {status === "success" && (
            <p className="mt-4 text-green-600">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
          
          {status === "error" && (
            <p className="mt-4 text-red-600">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}