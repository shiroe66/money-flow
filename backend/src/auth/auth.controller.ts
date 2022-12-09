import { Public } from '@app/common/decorators/metadata/public.decorator';
import { GetToken, GetUser } from '@app/common/decorators/requests';
import { RefreshGuard } from '@app/common/guards/refresh.guard';
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
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
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
  async refresh(
    @GetUser() user: User,
    @GetToken('refresh') token: string,
    @Res() response: Response,
  ) {
    const { exp } = await this.authService.decode(token);
    const expirationTimestamp = (exp - 60) * 1000;
    const currentTimestamp = new Date().getTime();

    const { access_token } = await this.authService.generateAccessToken(
      user.id,
      user.email,
    );
    response.setHeader('Authorization', `Bearer ${access_token}`);

    if (currentTimestamp >= expirationTimestamp) {
      const { refresh_token, exp } = await this.authService.generateRefreshToken(user);

      response.cookie('refresh', refresh_token, {
        httpOnly: true,
        sameSite: true,
        expires: new Date(exp * 1000),
        secure: process.env.NODE_ENV === 'production',
      });
    }

    response.send();
  }
}
