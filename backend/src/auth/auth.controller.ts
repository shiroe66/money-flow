import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.create(registerDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Req() request: Request) {
    const session = {
      ip: request.ip,
      ua: request.headers['user-agent'],
    };

    const { access_token, cookie } = await this.authService.login(loginDto, session);
    request.res.setHeader('Set-Cookie', cookie);
    return access_token;
  }
}
