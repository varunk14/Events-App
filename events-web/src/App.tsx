import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './auth';
import { api } from './api';
import type { EventItem } from './types';
import { AuthPanel } from './components/AuthPanel';
import { CreateEventForm } from './components/CreateEventForm';
import { EventList } from './components/EventList';

export default function App() {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const page = await api.listEvents();
      setEvents(page.items);
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          Events
        </div>
        {user ? (
          <div className="who">
            <span>{user.name}</span>
            <button className="ghost" onClick={signOut}>Sign out</button>
          </div>
        ) : null}
      </header>

      <main className="grid">
        <section className="col">
          {!user && <AuthPanel />}
          {user && <CreateEventForm onCreated={load} />}
        </section>

        <section className="col wide">
          <div className="col-head">
            <h2>Upcoming events</h2>
            <button className="ghost" onClick={load}>Refresh</button>
          </div>
          {err && <p className="error">{err}</p>}
          {loading
            ? <p className="muted">Loading…</p>
            : <EventList events={events} canRsvp={!!user} />}
        </section>
      </main>
    </div>
  );
}
