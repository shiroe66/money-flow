import { JwtConfigService } from '@app/config/jwt/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET_REFRESH,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    console.log(request);
    return payload;
  }
}
