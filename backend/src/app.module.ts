import { AppConfigModule } from '@app/config/app/config.module';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessGuard } from './common/guards';

@Module({
  imports: [AppConfigModule, PostgreSQLProviderModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: AccessGuard }],
})
export class AppModule {}
