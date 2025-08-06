// ABOUTME: Event history component showing user's RSVP history and upcoming events
// ABOUTME: Displays event details with status badges and quick actions

import Link from 'next/link';
import { UserProfile } from '../types';
import { format } from 'date-fns';

type EventHistoryProps = {
  user: UserProfile;
};

function getStatusBadge(status: string) {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded";
  
  switch (status) {
    case 'CONFIRMED':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'WAITLISTED':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'CANCELLED':
      return `${baseClasses} bg-gray-100 text-gray-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmed';
    case 'WAITLISTED':
      return 'Waitlisted';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

export function EventHistory({ user }: EventHistoryProps) {
  const { eventRsvps } = user;
  const now = new Date();
  
  const upcomingEvents = eventRsvps.filter(rsvp => 
    new Date(rsvp.event.startDate) > now && 
    rsvp.status !== 'CANCELLED'
  );
  
  const pastEvents = eventRsvps.filter(rsvp => 
    new Date(rsvp.event.startDate) <= now || 
    rsvp.status === 'CANCELLED'
  );

  if (eventRsvps.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-brand-brown mb-2">Event History</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your event RSVPs and history will appear here.
          </p>
        </div>
        
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You haven&apos;t RSVP&apos;d to any events yet.</p>
          <Link 
            href="/the-list"
            className="inline-block bg-brand-brown hover:bg-brand-rust text-white px-4 py-2 rounded transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-brand-brown mb-2">Event History</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your event RSVPs and upcoming events.
        </p>
      </div>

      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-brand-brown mb-3">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((rsvp) => (
              <div key={rsvp.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <Link 
                    href={`/the-list/${rsvp.event.id}`}
                    className="text-lg font-medium text-brand-brown hover:text-brand-rust transition-colors"
                  >
                    {rsvp.event.title}
                  </Link>
                  <span className={getStatusBadge(rsvp.status)}>
                    {getStatusText(rsvp.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rsvp.event.location}</p>
                <p className="text-sm text-gray-800">
                  {format(new Date(rsvp.event.startDate), 'EEEE, MMMM d, yyyy')} at{' '}
                  {format(new Date(rsvp.event.startDate), 'h:mm a')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  RSVP&apos;d on {format(new Date(rsvp.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-brand-brown mb-3">Past Events</h3>
          <div className="space-y-3">
            {pastEvents.slice(0, 5).map((rsvp) => (
              <div key={rsvp.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <Link 
                    href={`/the-list/${rsvp.event.id}`}
                    className="text-lg font-medium text-gray-700 hover:text-brand-brown transition-colors"
                  >
                    {rsvp.event.title}
                  </Link>
                  <span className={getStatusBadge(rsvp.status)}>
                    {getStatusText(rsvp.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rsvp.event.location}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(rsvp.event.startDate), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            ))}
            {pastEvents.length > 5 && (
              <p className="text-sm text-gray-600 text-center py-2">
                And {pastEvents.length - 5} more events...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}