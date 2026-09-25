import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Event } from './events/event.entity';
import { Rsvp } from './rsvp/rsvp.entity';

async function main() {
  const url = process.env.DATABASE_URL;
  const ds = new DataSource(
    url
      ? { type: 'postgres', url, entities: [User, Event, Rsvp], synchronize: true }
      : {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: +(process.env.DB_PORT || 5432),
          username: process.env.DB_USER || 'events',
          password: process.env.DB_PASSWORD || 'events_pass',
          database: process.env.DB_NAME || 'events_db',
          entities: [User, Event, Rsvp],
          synchronize: true,
        },
  );
  await ds.initialize();

  const email = process.env.SEED_EMAIL || 'demo@rescuerituals.dev';
  const password = process.env.SEED_PASSWORD || 'demo1234';

  const userRepo = ds.getRepository(User);
  let user = await userRepo.findOne({ where: { email } });
  if (!user) {
    user = await userRepo.save(userRepo.create({
      email, name: 'Demo Organizer',
      passwordHash: await bcrypt.hash(password, 10),
    }));
  }

  const eventRepo = ds.getRepository(Event);
  const count = await eventRepo.count();
  if (count === 0) {
    await eventRepo.save([
      eventRepo.create({
        title: 'Adoption Day (limited)', location: 'Bengaluru',
        description: 'Small venue, capacity 2 to demo the waitlist.',
        startsAt: new Date(Date.now() + 86400000),
        capacity: 2, createdById: user.id,
      }),
      eventRepo.create({
        title: 'Community Meetup (unlimited)', location: 'Online',
        description: 'No cap.',
        startsAt: new Date(Date.now() + 172800000),
        capacity: null, createdById: user.id,
      }),
    ]);
  }

  console.log(`Seeded. Login with ${email} / ${password}`);
  await ds.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
