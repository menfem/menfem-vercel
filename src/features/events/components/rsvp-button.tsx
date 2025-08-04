// ABOUTME: RSVP button component with loading states and user feedback
// ABOUTME: Shows different states for confirmed, waitlisted, and available RSVPs

'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { rsvpToEvent, cancelRsvp } from '../actions/rsvp-event'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface RsvpButtonProps {
  eventId: string
  userRsvp?: {
    id: string
    status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED'
  } | null
  isAtCapacity: boolean
  isAuthenticated: boolean
}

export function RsvpButton({ eventId, userRsvp, isAtCapacity, isAuthenticated }: RsvpButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRsvp = () => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    startTransition(async () => {
      const result = await rsvpToEvent(eventId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelRsvp(eventId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  // User has an RSVP
  if (userRsvp) {
    return (
      <div className="space-y-2">
        <Button 
          onClick={handleCancel}
          disabled={isPending}
          variant="outline"
          className="w-full border-brand-terracotta text-brand-terracotta hover:bg-brand-terracotta hover:text-white"
        >
          {isPending ? 'Cancelling...' : 'Cancel RSVP'}
        </Button>
        <p className="text-sm text-center text-brand-rust">
          {userRsvp.status === 'CONFIRMED' ? 'You\'re attending this event' : 'You\'re on the waitlist'}
        </p>
      </div>
    )
  }

  // No RSVP - show appropriate button
  return (
    <Button 
      onClick={handleRsvp}
      disabled={isPending}
      className="w-full bg-brand-terracotta hover:bg-brand-rust text-white"
    >
      {isPending 
        ? 'Processing...' 
        : isAtCapacity 
          ? 'Join Waitlist' 
          : 'RSVP Now'
      }
    </Button>
  )
}