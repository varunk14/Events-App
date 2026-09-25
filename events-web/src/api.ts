import type {
  AuthResponse, Attendees, EventItem, EventsPage, MyStatus,
} from './types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

let token: string | null = null;
export const setToken = (t: string | null) => { token = t; };

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  register: (email: string, name: string, password: string) =>
    req<AuthResponse>('/auth/register', {
      method: 'POST', body: JSON.stringify({ email, name, password }),
    }),
  login: (email: string, password: string) =>
    req<AuthResponse>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  listEvents: (page = 1) => req<EventsPage>(`/events?page=${page}&limit=50`),
  createEvent: (data: Partial<EventItem>) =>
    req<EventItem>('/events', { method: 'POST', body: JSON.stringify(data) }),
  attendees: (id: string) => req<Attendees>(`/events/${id}/attendees`),
  myStatus: (id: string) => req<{ status: MyStatus }>(`/events/${id}/rsvp/me`),
  rsvp: (id: string) => req(`/events/${id}/rsvp`, { method: 'POST' }),
  cancel: (id: string) => req(`/events/${id}/rsvp`, { method: 'DELETE' }),
};
