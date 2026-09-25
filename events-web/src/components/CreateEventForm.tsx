import { useState } from 'react';
import { api } from '../api';

export function CreateEventForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await api.createEvent({
        title,
        location: location || null,
        description: description || null,
        startsAt: new Date(startsAt).toISOString(),
        capacity: capacity ? Number(capacity) : null,
      });
      setTitle(''); setLocation(''); setStartsAt('');
      setCapacity(''); setDescription('');
      onCreated();
    } catch (e: any) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="card">
      <h3>Create an event</h3>
      <form onSubmit={submit} className="form">
        <label>Title
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            required placeholder="Adoption Day" />
        </label>
        <label>Location
          <input value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="Bengaluru" />
        </label>
        <label>Starts at
          <input type="datetime-local" value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)} required />
        </label>
        <label>Capacity <span className="hint">(blank = unlimited)</span>
          <input type="number" min={1} value={capacity}
            onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 50" />
        </label>
        <label>Description
          <textarea value={description} rows={2}
            onChange={(e) => setDescription(e.target.value)} />
        </label>
        {err && <p className="error">{err}</p>}
        <button className="primary" disabled={busy}>
          {busy ? 'Creating…' : 'Create event'}
        </button>
      </form>
    </div>
  );
}
