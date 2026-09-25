import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventOwnerGuard } from './event-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService, EventOwnerGuard],
  controllers: [EventsController],
})
export class EventsModule {}
