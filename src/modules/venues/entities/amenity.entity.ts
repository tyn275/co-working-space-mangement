import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venue } from './venue.entity';

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'jsonb' })
  name: Record<string, string>;

  @ManyToMany(() => Venue, (venue) => venue.amenities)
  venues: Venue[];
}
