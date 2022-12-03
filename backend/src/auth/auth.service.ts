import { ALREADY_EMAIL_EXIST, ALREADY_USERNAME_EXIST } from '@app/common';
import { JwtConfigService } from '@app/config/jwt/config.service';
import { UsersService } from '@app/models/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async create(registerDto: RegisterDto) {
    const findByEmail = this.userService.findOne('email', registerDto.email);
    const findByUsername = this.userService.findOne(
      'username',
      registerDto.username,
    );

    if (findByEmail) {
      throw new BadRequestException(ALREADY_EMAIL_EXIST);
    }

    if (findByUsername) {
      throw new BadRequestException(ALREADY_USERNAME_EXIST);
    }

    return this.userService.create(registerDto);
  }

  async login(loginDto: LoginDto) {}
}
