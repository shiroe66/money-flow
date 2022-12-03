import {
  ALREADY_EMAIL_EXIST,
  ALREADY_USERNAME_EXIST,
} from '@app/common/constants';
import { JwtPayload, Session } from '@app/common/interface';
import { JwtConfigService } from '@app/config/jwt/config.service';
import { RefreshSession } from '@app/models/refresh-session/entities/refresh-session.entity';
import { RefreshSessionService } from '@app/models/refresh-session/refresh-session.service';
import { UsersService } from '@app/models/users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
    const findByEmail = await this.userService.findOne(
      'email',
      registerDto.email,
    );
    const findByUsername = await this.userService.findOne(
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

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne('username', loginDto.username);

    if (!user) {
      throw new ForbiddenException();
    }

    const isValid = await user.validatePassword(loginDto.password);

    if (!isValid) {
      throw new ForbiddenException();
    }

    const access_token = await this.generateAccessToken(user.id, user.email);
    const refresh_settings = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_settings,
      user,
    };
  }

  private async generateAccessToken(id: string, email: string) {
    const payload = { sub: id, email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.secret,
      expiresIn: this.config.expires_in,
    });

    const { exp } = this.jwtService.decode(token) as JwtPayload;
    return { token, exp };
  }

  private async generateRefreshToken(id: string) {
    const payload = { sud: id };
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.refresh_secret,
      expiresIn: this.config.refresh_expires_in,
    });

    const { exp } = this.jwtService.decode(refresh_token) as JwtPayload;
    const cookieTime = new Date(exp * 1000).toUTCString();

    const cookie = `Refresh=${refresh_token}; HttpOnly; Path=/; Max-Age=${cookieTime}`;
    return { refresh_token, cookie, exp };
  }

  async saveRefreshSession(session: Session) {
    return this.refreshSessionService.create(session);
  }
}
