// ABOUTME: Main events listing page displaying upcoming London meetups and workshops
// ABOUTME: Shows hero section with description and grid of event cards

import { Suspense } from 'react'
import { getEvents } from '@/features/events/queries/get-events'
import { EventList } from '@/features/events/components/event-list'

export const metadata = {
  title: 'The List - Events & Meetups | MenFem',
  description: 'Join our London-based meetups, workshops, and community events. Connect with like-minded individuals exploring masculinity and femininity.'
}

async function EventsContent() {
  const { events } = await getEvents({ upcoming: true, limit: 12 })

  return <EventList events={events} />
}

function EventsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-brand-sand rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TheListPage() {
  return (
    <div className="min-h-screen bg-brand-sand">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-4">
            The List
          </h1>
          <p className="text-lg text-brand-rust max-w-2xl mx-auto">
            Join our London-based community events, workshops, and meetups. 
            Connect with others exploring the intersection of masculinity and femininity 
            in today's world.
          </p>
        </div>

        {/* Events Grid */}
        <Suspense fallback={<EventsLoading />}>
          <EventsContent />
        </Suspense>
      </div>
    </div>
  )
}