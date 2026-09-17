import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
} from 'class-validator';
import { IsStrongPasswordConstraint } from '../../../../common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123', description: 'Strong password' })
  @Validate(IsStrongPasswordConstraint)
  password: string;

  @ApiPropertyOptional({
    example: 'Nguyen Van A',
    description: 'User full name (optional)',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    example: '+84123456789',
    description: 'Phone number (optional)',
  })
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
}
