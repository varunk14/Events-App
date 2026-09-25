import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Rsvp } from '../rsvp/rsvp.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventOwnerGuard } from './event-owner.guard';
import { RsvpService } from '../rsvp/rsvp.service';
import { RsvpController } from '../rsvp/rsvp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Rsvp])],
  providers: [EventsService, RsvpService, EventOwnerGuard],
  controllers: [EventsController, RsvpController],
})
export class EventsModule {}
