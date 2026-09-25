import {
  Column, CreateDateColumn, Entity, Index, ManyToOne, JoinColumn,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';

export type RsvpStatus = 'going' | 'waitlisted' | 'cancelled';

@Entity('rsvps')
@Index(['eventId', 'userId'], { unique: true })
export class Rsvp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar', default: 'going' })
  status: RsvpStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
