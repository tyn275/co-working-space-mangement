import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../../../common/enums/user-status.enum';
import { Role } from './role.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { OtpVerification } from '../../auth/entities/otp-verification.entity';
import { Venue } from '../../venues/entities/venue.entity';
import { UserIdentityVerification } from './user-identity-verification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  fullName: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  @Column({ length: 5, default: 'vi' })
  language: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => OtpVerification, (otp) => otp.user)
  otpVerifications: OtpVerification[];

  @OneToMany(() => Venue, (v) => v.owner)
  ownedVenues: Venue[];

  @OneToMany(() => UserIdentityVerification, (v) => v.user)
  identityVerifications: UserIdentityVerification[];
}
