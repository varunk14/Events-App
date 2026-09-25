import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { EventsService } from './events.service';
import { EventOwnerGuard } from './event-owner.guard';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.events.findAll(page ? +page : 1, limit ? +limit : 20);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.events.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) {
    return this.events.create(dto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.events.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, EventOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.events.remove(id);
  }
}
