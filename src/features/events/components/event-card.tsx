// ABOUTME: Event card component displaying event summary information
// ABOUTME: Shows title, date, location, RSVP count and capacity with link to details

import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'

interface EventCardProps {
  event: {
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
  }
}

export function EventCard({ event }: EventCardProps) {
  const startDate = format(new Date(event.startDate), 'MMM d, yyyy')
  const startTime = format(new Date(event.startDate), 'h:mm a')
  const rsvpCount = event._count.rsvps

  return (
    <Link href={`/the-list/${event.id}`} className="group">
      <div className="bg-white border border-brand-sand rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-brand-terracotta">
        {event.imageUrl && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        <div className="p-6">
          <h3 className="font-bold text-lg text-brand-brown mb-2 group-hover:text-brand-terracotta transition-colors">
            {event.title}
          </h3>
          
          <p className="text-brand-rust text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="space-y-2 text-sm text-brand-brown">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-rust" />
              <span>{startDate} at {startTime}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-rust" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-rust" />
              <span>
                {rsvpCount} attending
                {event.capacity && ` · ${event.capacity} max`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}