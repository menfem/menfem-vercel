// ABOUTME: Query function to fetch published events with optional filtering
// ABOUTME: Supports pagination, date filtering, and includes RSVP counts

import { prisma } from '@/lib/prisma'

interface GetEventsOptions {
  limit?: number
  offset?: number
  upcoming?: boolean
}

export async function getEvents(options: GetEventsOptions = {}) {
  const { limit = 10, offset = 0, upcoming = true } = options

  const where = {
    isPublished: true,
    ...(upcoming && {
      startDate: {
        gte: new Date()
      }
    })
  }

  const [events, totalCount] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: {
        startDate: 'asc'
      },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: {
            rsvps: {
              where: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      }
    }),
    prisma.event.count({ where })
  ])

  return {
    events,
    totalCount,
    hasMore: totalCount > offset + limit
  }
}