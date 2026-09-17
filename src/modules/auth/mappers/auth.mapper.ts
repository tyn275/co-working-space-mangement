import { User } from '../../users/entities/user.entity';
import { RegisterResponseDto } from '../dto/register/register-response.dto';

export class AuthMapper {
  static toRegisterResponseDto(user: User): RegisterResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
