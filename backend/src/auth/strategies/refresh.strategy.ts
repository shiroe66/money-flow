import { JwtConfigService } from '@app/config/jwt/config.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: JwtConfigService) {
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

  validate(request: Request, payload: any) {
    console.log(request);
    return payload;
  }
}
