import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { PriceUnit } from '../../../common/enums/price-unit.enum';
import { User } from '../../users/entities/user.entity';
import { Space } from '../../spaces/entities/space.entity';

// Add constrant no_overlap (EXCLUDE USING gist) in migration file after generate
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'space_id', type: 'bigint' })
  spaceId: number;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  // Save in time booking, not be affected by changing price of venue
  @Column({ name: 'price_unit', type: 'enum', enum: PriceUnit })
  priceUnit: PriceUnit;

  @Column({ name: 'total_price', type: 'numeric', precision: 12, scale: 2 })
  totalPrice: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING_PAYMENT,
  })
  status: BookingStatus;

  @Column({ name: 'payment_deadline', type: 'timestamp' })
  paymentDeadline: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'space_id' })
  space: Space;
}
