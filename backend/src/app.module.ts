import { AppConfigModule } from '@app/config/app/config.module';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigModule, PostgreSQLProviderModule, AuthModule],
})
export class AppModule {}
