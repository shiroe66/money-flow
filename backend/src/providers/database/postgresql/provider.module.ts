import { PostgreSQLConfigModule } from '@app/config/database/postgresql/config.module';
import { PostgreSQLConfigService } from '@app/config/database/postgresql/config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgreSQLConfigModule],
      useFactory: (config: PostgreSQLConfigService) => ({
        type: config.type,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [__dirname + '/**/*.entity.ts'],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [PostgreSQLConfigService],
    }),
  ],
})
export class PostgreSQLProviderModule {}
