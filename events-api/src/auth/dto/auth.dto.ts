import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'varun@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Varun Krishna' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'strongpass123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'varun@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpass123' })
  @IsString()
  password: string;
}
