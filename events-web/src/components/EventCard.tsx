import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Attendees, EventItem, MyStatus } from '../types';

export function EventCard(
  { event, canRsvp }: { event: EventItem; canRsvp: boolean },
) {
  const [att, setAtt] = useState<Attendees | null>(null);
  const [status, setStatus] = useState<MyStatus>('none');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const a = await api.attendees(event.id);
    setAtt(a);
    if (canRsvp) {
      const s = await api.myStatus(event.id);
      setStatus(s.status);
    }
  };

  useEffect(() => { refresh(); }, [event.id, canRsvp]);

  const toggle = async () => {
    setBusy(true);
    try {
      if (status === 'going' || status === 'waitlisted') await api.cancel(event.id);
      else await api.rsvp(event.id);
      await refresh();
    } finally { setBusy(false); }
  };

  const full = event.capacity != null && (att?.goingCount ?? 0) >= event.capacity;
  const when = new Date(event.startsAt).toLocaleString();

  const badge =
    status === 'going' ? <span className="pill go">You are going</span>
    : status === 'waitlisted' ? <span className="pill wait">Waitlisted</span>
    : null;

  return (
    <article className="event">
      <div className="event-top">
        <h3>{event.title}</h3>
        {badge}
      </div>
      <p className="meta">
        {when}{event.location ? ` · ${event.location}` : ''}
      </p>
      {event.description && <p className="desc">{event.description}</p>}

      <div className="counts">
        <span className="count">
          <strong>{att?.goingCount ?? '—'}</strong>
          {event.capacity != null ? ` / ${event.capacity}` : ''} going
        </span>
        {(att?.waitlistedCount ?? 0) > 0 && (
          <span className="count muted">{att!.waitlistedCount} waitlisted</span>
        )}
        {full && status !== 'going' && <span className="pill full">Full</span>}
      </div>

      {canRsvp && (
        <button
          className={status === 'none' ? 'primary' : 'ghost'}
          disabled={busy}
          onClick={toggle}
        >
          {busy ? '…'
            : status === 'going' || status === 'waitlisted' ? 'Cancel RSVP'
            : full ? 'Join waitlist' : 'RSVP'}
        </button>
      )}
    </article>
  );
}
