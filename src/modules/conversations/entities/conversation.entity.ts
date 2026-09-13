import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

// UNIQUE INDEX (venue_id, user_id) in SQL — each user+venue pair has only 1 conversation
@Entity('conversations')
@Unique(['venueId', 'userId'])
export class Conversation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'venue_id', type: 'bigint' })
  venueId: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];
}
