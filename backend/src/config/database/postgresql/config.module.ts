import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSQLService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().default('pg'),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.string().default('5432'),
        DB_USERNAME: Joi.string().default('postgres'),
        DB_PASSWORD: Joi.string().default('postgres'),
        DB_DATABASE: Joi.string().default('database'),
      }),
    }),
  ],
  providers: [ConfigService, PostgreSQLService],
  exports: [ConfigService, PostgreSQLService],
})
export class PostgreSQLModule {}
