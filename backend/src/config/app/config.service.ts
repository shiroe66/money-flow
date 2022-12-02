import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  name() {
    return this.configService.get<string>('app.name');
  }

  env() {
    return this.configService.get<string>('app.env');
  }

  url() {
    return this.configService.get<string>('app.url');
  }

  port() {
    return Number(this.configService.get<string>('app.port'));
  }
}
