// ABOUTME: Event detail page showing full event information and RSVP functionality
// ABOUTME: Displays event image, description, location, time, and attendee information

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin, Users, ArrowLeft, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { getEvent } from '@/features/events/queries/get-event'
import { getAuth } from '@/features/auth/queries/get-auth'
import { RsvpButton } from '@/features/events/components/rsvp-button'
import { Button } from '@/components/ui/button'

interface EventPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEvent(params.id)
  
  if (!event) {
    return {
      title: 'Event Not Found | MenFem'
    }
  }

  return {
    title: `${event.title} | The List - MenFem`,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : undefined
    }
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const auth = await getAuth()
  const event = await getEvent(params.id, auth.user?.id)

  if (!event) {
    notFound()
  }

  const startDate = format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')
  const startTime = format(new Date(event.startDate), 'h:mm a')
  const endTime = format(new Date(event.endDate), 'h:mm a')

  return (
    <div className="min-h-screen bg-brand-sand">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/the-list" className="inline-flex items-center gap-2 text-brand-brown hover:text-brand-terracotta mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to The List
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.imageUrl && (
              <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Event Title and Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-brand-brown mb-4">
                {event.title}
              </h1>
              
              <div className="prose prose-brand max-w-none">
                <p className="text-brand-rust leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-brand-brown mb-4">
                Join This Event
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-brand-rust" />
                  <div>
                    <div className="font-medium text-brand-brown">{startDate}</div>
                    <div className="text-sm text-brand-rust">{startTime} - {endTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand-rust" />
                  <div className="text-brand-brown">{event.location}</div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-brand-rust" />
                  <div className="text-brand-brown">
                    <span className="font-medium">{event.confirmedCount}</span> attending
                    {event.capacity && (
                      <span className="text-brand-rust"> · {event.capacity} max</span>
                    )}
                  </div>
                </div>
              </div>

              <RsvpButton 
                eventId={event.id}
                userRsvp={event.userRsvp}
                isAtCapacity={event.isAtCapacity}
                isAuthenticated={!!auth.user}
              />

              {event.isAtCapacity && (
                <p className="text-sm text-brand-rust mt-3 text-center">
                  This event is at capacity. Join the waitlist to be notified if spots open up.
                </p>
              )}
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg text-brand-brown mb-4">
                Event Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-brand-brown">Date:</strong>
                  <div className="text-brand-rust">{startDate}</div>
                </div>
                
                <div>
                  <strong className="text-brand-brown">Time:</strong>
                  <div className="text-brand-rust">{startTime} - {endTime}</div>
                </div>
                
                <div>
                  <strong className="text-brand-brown">Location:</strong>
                  <div className="text-brand-rust">{event.location}</div>
                </div>
                
                {event.capacity && (
                  <div>
                    <strong className="text-brand-brown">Capacity:</strong>
                    <div className="text-brand-rust">{event.capacity} people</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}