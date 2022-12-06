import { Public } from '@app/common/decorators/metadata/public.decorator';
import { RefreshGuard } from '@app/common/guards';
import { TokenInterceptor } from '@app/common/interceptors';
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
  async refresh() {
    return this.authService.refresh();
  }
}
