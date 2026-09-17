import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConf = configService.get('app');

  app.enableCors({
    origin: appConf.corsOrigins,
    credentials: true,
  });

  // Turn on I18nValidationPipe
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true, // Only allow properties that are defined in the DTO
      forbidNonWhitelisted: true, // Reject requests with properties that are not defined in the DTO
      transform: true, // Automatically transform incoming data (URL params, Query params, JSON Body) to match the DTO
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  const swaggerConf = configService.get('swagger');
  if (swaggerConf.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConf.title)
      .setDescription(swaggerConf.description)
      .setVersion(swaggerConf.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConf.path, app, document);
  }

  await app.listen(appConf.port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${appConf.port}`);
  if (swaggerConf.enabled) {
    const swaggerPath = String(swaggerConf.path).replace(/^\//, '');
    logger.log(
      `Swagger documentation: http://localhost:${appConf.port}/${swaggerPath}`,
    );
  }
}
bootstrap();
