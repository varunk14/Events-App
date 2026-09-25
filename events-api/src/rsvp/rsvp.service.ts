import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Event } from '../events/event.entity';
import { Rsvp } from './rsvp.entity';

@Injectable()
export class RsvpService {
  constructor(private readonly dataSource: DataSource) {}

  async join(eventId: string, userId: string) {
    return this.dataSource.transaction(async (m) => {
      const event = await m.findOne(Event, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) throw new NotFoundException('Event not found');

      const existing = await m.findOne(Rsvp, { where: { eventId, userId } });
      if (existing) {
        if (existing.status === 'cancelled') {
          existing.status = await this.decideStatus(m, event, userId);
          return m.save(existing);
        }
        return existing;
      }

      const status = await this.decideStatus(m, event, userId);
      const rsvp = m.create(Rsvp, { eventId, userId, status });
      return m.save(rsvp);
    });
  }

  private async decideStatus(m: any, event: Event, userId: string) {
    if (event.capacity == null) return 'going';
    const going = await m.count(Rsvp, {
      where: { eventId: event.id, status: 'going' },
    });
    return going < event.capacity ? 'going' : 'waitlisted';
  }

  async cancel(eventId: string, userId: string) {
    return this.dataSource.transaction(async (m) => {
      const event = await m.findOne(Event, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) throw new NotFoundException('Event not found');

      const rsvp = await m.findOne(Rsvp, { where: { eventId, userId } });
      if (!rsvp || rsvp.status === 'cancelled') {
        return { cancelled: true };
      }

      const wasGoing = rsvp.status === 'going';
      rsvp.status = 'cancelled';
      await m.save(rsvp);

      if (wasGoing && event.capacity != null) {
        const next = await m.findOne(Rsvp, {
          where: { eventId, status: 'waitlisted' },
          order: { createdAt: 'ASC' },
        });
        if (next) {
          next.status = 'going';
          await m.save(next);
        }
      }
      return { cancelled: true };
    });
  }

  async attendees(eventId: string) {
    const rsvps = await this.dataSource.getRepository(Rsvp).find({
      where: { eventId },
      order: { createdAt: 'ASC' },
    });
    const going = rsvps.filter((r) => r.status === 'going');
    const waitlisted = rsvps.filter((r) => r.status === 'waitlisted');
    return {
      goingCount: going.length,
      waitlistedCount: waitlisted.length,
      going: going.map((r) => ({ userId: r.userId, name: r.user?.name })),
      waitlisted: waitlisted.map((r) => ({ userId: r.userId, name: r.user?.name })),
    };
  }

  async myRsvp(eventId: string, userId: string) {
    const rsvp = await this.dataSource.getRepository(Rsvp)
      .findOne({ where: { eventId, userId } });
    return { status: rsvp?.status ?? 'none' };
  }
}
