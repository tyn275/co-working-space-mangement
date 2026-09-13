import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
