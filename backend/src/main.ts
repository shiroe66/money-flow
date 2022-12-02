import { AppModule } from '@app/app.module';
import { AppConfigService } from '@app/config/app/config.service';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get(AppConfigService);

  await app.listen(appConfig.port());
  console.log(`Server started at ${appConfig.url()} 🚀`);
}
bootstrap();
