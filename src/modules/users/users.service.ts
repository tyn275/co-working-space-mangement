import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleType } from '../../common';

@Injectable()
export class UsersService {
  private defaultUserRole: Role | null = null;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async getDefaultUserRole(): Promise<Role | null> {
    if (!this.defaultUserRole) {
      this.defaultUserRole = await this.roleRepository.findOne({
        where: { name: RoleType.USER },
      });
    }
    return this.defaultUserRole;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const defaultRole = await this.getDefaultUserRole();

    const user = this.userRepository.create({
      ...userData,
      roles: defaultRole ? [defaultRole] : [],
    });

    return this.userRepository.save(user);
  }
}
