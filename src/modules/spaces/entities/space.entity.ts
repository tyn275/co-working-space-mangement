import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpaceType } from '../../../common/enums/space-type.enum';
import { Venue } from '../../venues/entities/venue.entity';
import { SpacePrice } from './space-price.entity';

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'venue_id', type: 'bigint' })
  venueId: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: SpaceType })
  type: SpaceType;

  @Column({ nullable: true, type: 'int' })
  capacity: number | null;

  @Column({ nullable: true, type: 'jsonb' })
  description?: Record<string, string> | null;

  // Return string format 'HH:mm:ss'
  @Column({ name: 'open_time', type: 'time', nullable: true })
  openTime: string | null;

  @Column({ name: 'close_time', type: 'time', nullable: true })
  closeTime: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Venue, (v) => v.spaces)
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @OneToMany(() => SpacePrice, (sp) => sp.space)
  prices: SpacePrice[];
}
