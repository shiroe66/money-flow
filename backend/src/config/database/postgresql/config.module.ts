import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSQLConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().default('postgres'),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.string().default('5432'),
        DB_USERNAME: Joi.string().default('postgres'),
        DB_PASSWORD: Joi.string().default('postgres'),
        DB_DATABASE: Joi.string().default('database'),
      }),
    }),
  ],
  providers: [ConfigService, PostgreSQLConfigService],
  exports: [ConfigService, PostgreSQLConfigService],
})
export class PostgreSQLConfigModule {}
