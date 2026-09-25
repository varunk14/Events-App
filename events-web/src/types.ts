export interface User { id: string; email: string; name: string; }

export interface AuthResponse { accessToken: string; user: User; }

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  capacity: number | null;
  createdById: string;
}

export interface EventsPage {
  items: EventItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Attendees {
  goingCount: number;
  waitlistedCount: number;
  going: { userId: string; name?: string }[];
  waitlisted: { userId: string; name?: string }[];
}

export type MyStatus = 'going' | 'waitlisted' | 'cancelled' | 'none';
