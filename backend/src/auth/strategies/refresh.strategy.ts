import { JwtPayload } from '@app/common/interface';
import { JwtConfigService } from '@app/config/jwt/config.service';
import { RefreshSessionService } from '@app/models/refresh-session/refresh-session.service';
import { UsersService } from '@app/models/users/users.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: JwtConfigService,
    private refreshSessionService: RefreshSessionService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh;
        },
      ]),
      secretOrKey: config.refresh_secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: Omit<JwtPayload, 'email'>) {
    const token = request.cookies.refresh;
    const session = this.refreshSessionService.verify(token, payload.sub);

    if (session) {
      const user = await this.userService.findOne('id', payload.sub);
      return user;
    }

    return session;
  }
}
