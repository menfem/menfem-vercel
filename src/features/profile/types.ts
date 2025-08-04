// ABOUTME: Type definitions for user profile feature module
// ABOUTME: Includes profile data, event history, and dashboard statistics

import { User, EventRsvp, Event, NewsletterSubscription } from '@prisma/client';

export type UserProfile = User & {
  newsletters: NewsletterSubscription[];
  eventRsvps: (EventRsvp & {
    event: Event;
  })[];
};

export type UserStats = {
  totalEvents: number;
  upcomingEvents: number;
  newsletterSubscribed: boolean;
  memberSince: Date;
};

export type UpdateProfileData = {
  username?: string;
  email?: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};