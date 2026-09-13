import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OtpPurpose } from '../../../common/enums/otp-purpose.enum';
import { User } from '../../users/entities/user.entity';

@Entity('otp_verifications')
export class OtpVerification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  // Store 6 digit OTP code
  @Column({ name: 'otp_code', length: 6 })
  otpCode: string;

  @Column({
    type: 'enum',
    enum: OtpPurpose,
  })
  purpose: OtpPurpose;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.otpVerifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
