import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/models/users/entities/user.entity';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (user: User) => {
        const response = ctx.switchToHttp().getResponse<Response>();

        const { refresh_token, exp } = await this.authService.generateRefreshToken(user);
        const { access_token } = await this.authService.generateAccessToken(
          user.id,
          user.email,
        );

        response.setHeader('Authorization', `Bearer ${access_token}`);
        response.cookie('refresh', refresh_token, {
          httpOnly: true,
          sameSite: true,
          maxAge: exp,
          secure: process.env.NODE_ENV === 'production',
        });

        return user;
      }),
    );
  }
}
