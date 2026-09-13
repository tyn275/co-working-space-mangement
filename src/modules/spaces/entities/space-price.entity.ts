import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PriceUnit } from '../../../common/enums/price-unit.enum';
import { Space } from './space.entity';

@Entity('space_prices')
@Unique(['spaceId', 'unit'])
export class SpacePrice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'space_id', type: 'bigint' })
  spaceId: number;

  @Column({ type: 'enum', enum: PriceUnit })
  unit: PriceUnit;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Space, (s) => s.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space: Space;
}
