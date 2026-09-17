import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { UserStatus } from '../../common';
import { UsersService } from '../users/users.service';
import { RegisterRequestDto } from './dto/register/register-request.dto';
import { RegisterResponseDto } from './dto/register/register-response.dto';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    // Run email check and bcrypt hash concurrently to save latency
    const saltRounds = 10;
    const [existingUser, passwordHash] = await Promise.all([
      this.usersService.findByEmail(dto.email),
      bcrypt.hash(dto.password, saltRounds),
    ]);

    if (existingUser) {
      const message = this.i18n.t('common.auth.email_exists');
      throw new ConflictException(message);
    }

    // Create new user via UsersService
    const newUser = await this.usersService.create({
      email: dto.email,
      passwordHash: passwordHash,
      fullName: dto.fullName || null,
      phone: dto.phone || null,
      status: UserStatus.INACTIVE,
      isVerified: false,
    });

    // 4. Return response DTO using AuthMapper
    return AuthMapper.toRegisterResponseDto(newUser);
  }
}
