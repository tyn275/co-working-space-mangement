import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../../../../common';

export class RegisterResponseDto {
  @ApiProperty({ example: 1, description: 'Unique user identifier' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiPropertyOptional({
    example: 'Nguyen Van A',
    nullable: true,
    description: 'User full name',
  })
  fullName?: string | null;

  @ApiPropertyOptional({
    example: '+84987654321',
    nullable: true,
    description: 'User phone number',
  })
  phone?: string | null;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.INACTIVE,
    description: 'Initial account status (inactive until verified)',
  })
  status: UserStatus;

  @ApiProperty({ example: false, description: 'Account verification status' })
  isVerified: boolean;

  @ApiProperty({
    example: '2026-09-17T23:00:00.000Z',
    description: 'Account creation timestamp',
  })
  createdAt: Date;
}
