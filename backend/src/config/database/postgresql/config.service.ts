import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgreSQLConfigService {
  constructor(private configService: ConfigService) {}

  get type() {
    return this.configService.get('postgresql.type');
  }

  get host() {
    return this.configService.get<string>('postgresql.host');
  }

  get port() {
    return Number(this.configService.get<string>('postgresql.port'));
  }

  get username() {
    return this.configService.get<string>('postgresql.username');
  }
  get password() {
    return this.configService.get<string>('postgresql.password');
  }
  get database() {
    return this.configService.get<string>('postgresql.database');
  }
}
