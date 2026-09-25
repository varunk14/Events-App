import {
  CanActivate, ExecutionContext, ForbiddenException,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Event) private readonly events: Repository<Event>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const event = await this.events.findOne({ where: { id: req.params.id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.createdById !== req.user.id) {
      throw new ForbiddenException('Only the creator can modify this event');
    }
    req.event = event;
    return true;
  }
}
