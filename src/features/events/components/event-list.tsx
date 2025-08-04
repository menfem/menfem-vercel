// ABOUTME: Event list container component rendering a grid of event cards
// ABOUTME: Handles empty state when no events are available

import { EventCard } from './event-card'

interface EventListProps {
  events: Array<{
    id: string
    title: string
    description: string
    location: string
    startDate: Date
    endDate: Date
    capacity: number | null
    imageUrl: string | null
    _count: {
      rsvps: number
    }
  }>
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-brand-brown mb-2">No upcoming events</h3>
        <p className="text-brand-rust">Check back soon for new London meetups and workshops.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}