// ABOUTME: User dashboard component with personalized stats and quick actions
// ABOUTME: Displays user statistics, upcoming events, and navigation links

import Link from 'next/link';
import { UserProfile, UserStats } from '../types';
import { format } from 'date-fns';

type UserDashboardProps = {
  user: UserProfile;
  stats: UserStats;
};

export function UserDashboard({ user, stats }: UserDashboardProps) {
  const upcomingEvents = user.eventRsvps
    .filter(rsvp => 
      new Date(rsvp.event.startDate) > new Date() && 
      rsvp.status !== 'CANCELLED'
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-brand-sage/20 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-brand-brown mb-2">
          Welcome back{user.username ? `, ${user.username}` : ''}!
        </h1>
        <p className="text-gray-700">
          Here's what's happening with your MenFem account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-brand-brown">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
              <span className="text-brand-brown text-xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-brand-brown">{stats.upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
              <span className="text-brand-brown text-xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Newsletter</p>
              <p className="text-sm font-bold text-brand-brown">
                {stats.newsletterSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
              <span className="text-brand-brown text-xl">
                {stats.newsletterSubscribed ? '✉️' : '📪'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-brand-brown mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/articles"
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">📚</span>
            <span className="font-medium text-gray-800">Read Articles</span>
          </Link>
          
          <Link 
            href="/the-list"
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">🎪</span>
            <span className="font-medium text-gray-800">Browse Events</span>
          </Link>
          
          <Link 
            href="/profile"
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">⚙️</span>
            <span className="font-medium text-gray-800">Edit Profile</span>
          </Link>
          
          {!stats.newsletterSubscribed && (
            <Link 
              href="/newsletter/subscribe"
              className="flex items-center space-x-3 p-3 rounded-lg bg-brand-sage/20 hover:bg-brand-sage/30 transition-colors"
            >
              <span className="text-lg">📬</span>
              <span className="font-medium text-brand-brown">Subscribe</span>
            </Link>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-brand-brown">Upcoming Events</h2>
            <Link 
              href="/profile"
              className="text-sm text-brand-brown hover:text-brand-rust transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Link 
                    href={`/the-list/${rsvp.event.id}`}
                    className="font-medium text-brand-brown hover:text-brand-rust transition-colors"
                  >
                    {rsvp.event.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {format(new Date(rsvp.event.startDate), 'MMM d, yyyy')} • {rsvp.event.location}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  rsvp.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {rsvp.status === 'CONFIRMED' ? 'Confirmed' : 'Waitlisted'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Since */}
      <div className="text-center text-sm text-gray-600">
        Member since {format(stats.memberSince, 'MMMM yyyy')}
      </div>
    </div>
  );
}