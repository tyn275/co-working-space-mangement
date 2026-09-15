import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VenueStatus } from '../../../common/enums/venue-status.enum';
import { User } from '../../users/entities/user.entity';
import { Amenity } from './amenity.entity';
import { Space } from '../../spaces/entities/space.entity';
import { VenueBusinessVerification } from './venue-business-verification.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'owner_id', type: 'bigint' })
  ownerId: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'jsonb' })
  description?: Record<string, string> | null;

  @Column({ type: 'varchar', nullable: true })
  street: string | null;

  @Column()
  city: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: string | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: string | null;

  @Column({
    type: 'enum',
    enum: VenueStatus,
    default: VenueStatus.PENDING,
  })
  status: VenueStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (u) => u.ownedVenues)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToMany(() => Amenity, (amenity) => amenity.venues)
  @JoinTable({
    name: 'venue_amenities',
    joinColumn: { name: 'venue_id' },
    inverseJoinColumn: { name: 'amenity_id' },
  })
  amenities: Amenity[];

  @OneToMany(() => Space, (s) => s.venue)
  spaces: Space[];

  @OneToMany(() => VenueBusinessVerification, (v) => v.venue)
  businessVerifications: VenueBusinessVerification[];
}
