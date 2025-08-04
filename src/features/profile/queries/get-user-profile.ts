// ABOUTME: Query to fetch complete user profile with events and newsletter data
// ABOUTME: Includes event history, newsletter subscriptions, and user statistics

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { UserProfile, UserStats } from '../types';

export const getUserProfile = cache(async (userId: string): Promise<UserProfile | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        newsletters: {
          where: { isActive: true },
        },
        eventRsvps: {
          include: {
            event: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
});

export const getUserStats = cache(async (userId: string): Promise<UserStats> => {
  try {
    const [totalEvents, upcomingEvents, user] = await Promise.all([
      prisma.eventRsvp.count({
        where: { 
          userId,
          status: { in: ['CONFIRMED', 'WAITLISTED'] }
        },
      }),
      prisma.eventRsvp.count({
        where: { 
          userId,
          status: { in: ['CONFIRMED', 'WAITLISTED'] },
          event: {
            startDate: {
              gte: new Date(),
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          newsletters: {
            where: { isActive: true },
          },
        },
      }),
    ]);

    return {
      totalEvents,
      upcomingEvents,
      newsletterSubscribed: (user?.newsletters?.length ?? 0) > 0,
      memberSince: user?.createdAt ?? new Date(),
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      newsletterSubscribed: false,
      memberSince: new Date(),
    };
  }
});