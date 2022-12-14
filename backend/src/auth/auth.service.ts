import {
  ALREADY_EMAIL_EXIST,
  ALREADY_USERNAME_EXIST,
  USER_LOGIN_ERROR,
  USER_NOT_FOUND,
} from '@app/common/constants';
import { JwtPayload } from '@app/common/interface';
import { JwtConfigService } from '@app/config/jwt/config.service';
import { RefreshSessionService } from '@app/models/refresh-session/refresh-session.service';
import { User } from '@app/models/users/entities/user.entity';
import { UsersService } from '@app/models/users/users.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private refreshSessionService: RefreshSessionService,
    private config: JwtConfigService,
  ) {}

  async create(registerDto: RegisterDto) {
    const findByEmail = await this.userService.findOne('email', registerDto.email);
    const findByUsername = await this.userService.findOne(
      'username',
      registerDto.username,
    );

    if (findByEmail) {
      throw new ConflictException(ALREADY_EMAIL_EXIST);
    }

    if (findByUsername) {
      throw new ConflictException(ALREADY_USERNAME_EXIST);
    }

    return this.userService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne('username', loginDto.username);
    if (!user) {
      throw new ForbiddenException(USER_LOGIN_ERROR);
    }

    const isValid = await user.validatePassword(loginDto.password);
    if (!isValid) {
      throw new ForbiddenException(USER_LOGIN_ERROR);
    }

    return user;
  }

  async verify(payload: JwtPayload) {
    const user = await this.userService.findOne('id', payload.sub);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    return user;
  }

  async decode(token: string) {
    const decoded = this.jwtService.decode(token);
    return decoded as JwtPayload;
  }

  async generateAccessToken(id: string, email: string) {
    const payload = { sub: id, email };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.secret,
      expiresIn: this.config.expires_in,
    });

    return { access_token };
  }

  async generateRefreshToken(user: User) {
    const payload = { sub: user.id };
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.refresh_secret,
      expiresIn: this.config.refresh_expires_in,
    });

    const { exp } = await this.decode(refresh_token);
    await this.refreshSessionService.create({ exp, refresh_token, user });

    return { refresh_token, exp };
  }
}
