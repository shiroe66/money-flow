import { USER_NOT_FOUND } from '@app/common/constants';
import { JwtPayload } from '@app/common/interface';
import { JwtConfigService } from '@app/config/jwt/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: JwtConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.verify(payload);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    return user;
  }
}
