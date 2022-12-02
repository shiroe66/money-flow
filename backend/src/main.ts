import { AppModule } from '@app/app.module';
import { AppConfigService } from '@app/config/app/config.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigService = app.get(AppConfigService);

  const config = new DocumentBuilder()
    .setTitle('Accounting')
    .setDescription('Accounting for your income and expenses API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port());
  console.log(`Server started at ${appConfig.url()} 🚀`);
}
bootstrap();
