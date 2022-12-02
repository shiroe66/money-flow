import { AppConfigModule } from '@app/config/app/config.module';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, PostgreSQLProviderModule],
})
export class AppModule {}
