import { Public } from '@app/common/decorators/metadata/public.decorator';
import { GetUser } from '@app/common/decorators/requests';
import { RefreshGuard } from '@app/common/guards';
import { TokenInterceptor } from '@app/common/interceptors';
import { User } from '@app/models/users/entities/user.entity';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async create(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.create(registerDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseInterceptors(TokenInterceptor)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  @UseInterceptors(TokenInterceptor)
  async refresh(@GetUser() user: User) {
    return user;
  }
}
