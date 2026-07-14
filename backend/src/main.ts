import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
   * Préfixe global
   * Toutes les routes commenceront par /api
   */

  app.setGlobalPrefix('api');

  /*
   * Versionnement des API
   * Exemple :
   * /api/v1/users
   */

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /*
   * Validation globale
   */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /*
   * Swagger
   */

  const config = new DocumentBuilder()
    .setTitle('Tontine Management API')
    .setDescription('API REST de gestion des tontines')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  /*
   * CORS
   */

  app.enableCors({
    origin: true,
    credentials: true,
  });

  /*
   * Port
   */

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(
    `🚀 Server running at http://localhost:${port}/api/v1`,
  );

  console.log(
    `📚 Swagger available at http://localhost:${port}/docs`,
  );
}

bootstrap();