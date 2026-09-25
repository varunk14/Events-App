import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
  ) {}

  create(dto: CreateEventDto, userId: string) {
    const event = this.repo.create({
      ...dto,
      startsAt: new Date(dto.startsAt),
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      capacity: dto.capacity ?? null,
      createdById: userId,
    });
    return this.repo.save(event);
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.repo.findAndCount({
      order: { startsAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.findOne(id);
    Object.assign(event, {
      ...dto,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : event.startsAt,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : event.endsAt,
    });
    return this.repo.save(event);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
