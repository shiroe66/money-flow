import { JwtConfigModule } from '@app/config/jwt/config.module';
import { RefreshSessionModule } from '@app/models/refresh-session/refresh-session.module';
import { UsersModule } from '@app/models/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, RefreshStrategy } from './strategies';

@Module({
  imports: [
    UsersModule,
    JwtConfigModule,
    PassportModule,
    JwtModule,
    RefreshSessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
