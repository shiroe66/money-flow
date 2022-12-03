import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secret() {
    return this.configService.get<string>('JWT_SECRET');
  }

  get expires_in() {
    return this.configService.get<string>('EXPIRES_IN');
  }

  get refresh_secret() {
    return this.configService.get<string>('JWT_SECRET_REFRESH');
  }

  get refresh_expires_in() {
    return this.configService.get<string>('REFRESH_EXPIRES_IN');
  }
}
