import type { EventItem } from '../types';
import { EventCard } from './EventCard';

export function EventList(
  { events, canRsvp }: { events: EventItem[]; canRsvp: boolean },
) {
  if (!events.length) return <p className="muted">No events yet.</p>;
  return (
    <div className="events">
      {events.map((e) => (
        <EventCard key={e.id} event={e} canRsvp={canRsvp} />
      ))}
    </div>
  );
}
