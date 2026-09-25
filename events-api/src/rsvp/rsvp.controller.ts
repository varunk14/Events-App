import {
  Controller, Delete, Get, Param, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { RsvpService } from './rsvp.service';

@ApiTags('rsvp')
@Controller('events/:id')
export class RsvpController {
  constructor(private readonly rsvp: RsvpService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('rsvp')
  join(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rsvp.join(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('rsvp')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rsvp.cancel(id, user.id);
  }

  @Get('attendees')
  attendees(@Param('id') id: string) {
    return this.rsvp.attendees(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('rsvp/me')
  mine(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.rsvp.myRsvp(id, user.id);
  }
}
