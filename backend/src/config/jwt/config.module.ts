import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../app/configuration';
import { JwtConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        secret: Joi.string().default('im secret'),
        expires_in: Joi.string().default('15m'),
        refresh_secret: Joi.string().default('im refresh secret'),
        refresh_expires_in: Joi.string().default('24h'),
      }),
    }),
  ],
  providers: [ConfigService, JwtConfigService],
  exports: [ConfigService, JwtConfigService],
})
export class JwtConfigModule {}
