import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDateString, IsInt, IsOptional, IsString, MinLength, Min,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Adoption Day' })
  @IsString() @MinLength(1)
  title: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsOptional() @IsString()
  location?: string;

  @ApiProperty({ example: '2026-10-01T10:00:00Z' })
  @IsDateString()
  startsAt: string;

  @ApiPropertyOptional({ example: '2026-10-01T12:00:00Z' })
  @IsOptional() @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({ example: 50, description: 'Omit for unlimited' })
  @IsOptional() @IsInt() @Min(1)
  capacity?: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
