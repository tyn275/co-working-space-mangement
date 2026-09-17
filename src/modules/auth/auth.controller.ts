import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register/register-request.dto';
import { RegisterResponseDto } from './dto/register/register-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered with INACTIVE status',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email is already in use',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }
}
