// ABOUTME: Not found page for events that don't exist or are not published
// ABOUTME: Provides helpful navigation back to events list

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarX } from 'lucide-react'

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <CalendarX className="h-16 w-16 text-brand-rust mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-brand-brown mb-4">
          Event Not Found
        </h1>
        
        <p className="text-brand-rust mb-8">
          The event you're looking for doesn't exist or is no longer available. 
          It may have been cancelled or moved.
        </p>
        
        <Link href="/the-list">
          <Button className="bg-brand-terracotta hover:bg-brand-rust text-white">
            Browse All Events
          </Button>
        </Link>
      </div>
    </div>
  )
}