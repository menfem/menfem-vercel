// ABOUTME: Server action to handle event RSVPs with capacity management
// ABOUTME: Manages confirmed RSVPs and waitlist when at capacity

'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/features/auth/queries/get-auth'
import { redirect } from 'next/navigation'

export async function rsvpToEvent(eventId: string) {
  const auth = await getAuth()
  
  if (!auth.user) {
    redirect('/auth/signin')
  }

  if (!auth.user.emailVerified) {
    throw new Error('Please verify your email to RSVP to events')
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            rsvps: {
              where: { status: 'CONFIRMED' }
            }
          }
        }
      }
    })

    if (!event || !event.isPublished) {
      throw new Error('Event not found')
    }

    // Check if user already has an RSVP
    const existingRsvp = await prisma.eventRsvp.findUnique({
      where: {
        userId_eventId: {
          userId: auth.user.id,
          eventId
        }
      }
    })

    if (existingRsvp) {
      throw new Error('You have already RSVP\'d to this event')
    }

    // Determine RSVP status based on capacity
    const confirmedCount = event._count.rsvps
    const isAtCapacity = event.capacity ? confirmedCount >= event.capacity : false
    const rsvpStatus = isAtCapacity ? 'WAITLISTED' : 'CONFIRMED'

    await prisma.eventRsvp.create({
      data: {
        userId: auth.user.id,
        eventId,
        status: rsvpStatus
      }
    })

    revalidatePath(`/the-list/${eventId}`)
    revalidatePath('/the-list')

    return { 
      success: true, 
      status: rsvpStatus,
      message: rsvpStatus === 'WAITLISTED' 
        ? 'You\'ve been added to the waitlist' 
        : 'RSVP confirmed!'
    }

  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to RSVP' 
    }
  }
}

export async function cancelRsvp(eventId: string) {
  const auth = await getAuth()
  
  if (!auth.user) {
    redirect('/auth/signin')
  }

  try {
    const existingRsvp = await prisma.eventRsvp.findUnique({
      where: {
        userId_eventId: {
          userId: auth.user.id,
          eventId
        }
      }
    })

    if (!existingRsvp) {
      throw new Error('No RSVP found to cancel')
    }

    await prisma.$transaction(async (tx) => {
      // Delete the RSVP
      await tx.eventRsvp.delete({
        where: { id: existingRsvp.id }
      })

      // If this was a confirmed RSVP, promote someone from waitlist
      if (existingRsvp.status === 'CONFIRMED') {
        const waitlistRsvp = await tx.eventRsvp.findFirst({
          where: {
            eventId,
            status: 'WAITLISTED'
          },
          orderBy: {
            createdAt: 'asc'
          }
        })

        if (waitlistRsvp) {
          await tx.eventRsvp.update({
            where: { id: waitlistRsvp.id },
            data: { status: 'CONFIRMED' }
          })
        }
      }
    })

    revalidatePath(`/the-list/${eventId}`)
    revalidatePath('/the-list')

    return { success: true, message: 'RSVP cancelled' }

  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to cancel RSVP' 
    }
  }
}