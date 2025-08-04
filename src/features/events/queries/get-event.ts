// ABOUTME: Query function to fetch a single event by ID with RSVP details
// ABOUTME: Includes full event details and user's RSVP status if authenticated

import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export const getEvent = cache(async (id: string, userId?: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id,
      isPublished: true
    },
    include: {
      _count: {
        select: {
          rsvps: {
            where: {
              status: 'CONFIRMED'
            }
          }
        }
      },
      ...(userId && {
        rsvps: {
          where: {
            userId
          },
          select: {
            id: true,
            status: true,
            createdAt: true
          }
        }
      })
    }
  })

  if (!event) {
    return null
  }

  const confirmedCount = event._count.rsvps
  const isAtCapacity = event.capacity ? confirmedCount >= event.capacity : false
  const userRsvp = userId && event.rsvps ? event.rsvps[0] : null

  return {
    ...event,
    confirmedCount,
    isAtCapacity,
    userRsvp
  }
})