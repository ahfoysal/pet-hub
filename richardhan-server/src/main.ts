import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      // Local development
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
      // lvh.me subdomains (local dev with subdomains)
      'http://auth.lvh.me:3000',
      'http://admin.lvh.me:3001',
      'http://hotel.lvh.me:3002',
      'http://vendor.lvh.me:3003',
      'http://sitter.lvh.me:3004',
      'http://owner.lvh.me:3005',
      'http://school.lvh.me:3006',
      'http://lvh.me:3000',
      'http://lvh.me:3001',
      'http://lvh.me:3002',
      'http://lvh.me:3003',
      'http://lvh.me:3004',
      'http://lvh.me:3005',
      'http://lvh.me:3006',
      // Ngrok
      'https://clever-iguana-terminally.ngrok-free.app',
      // Vercel Production
      'https://richardhan-frontend-web.vercel.app',
      'https://auth-pethub-rnc.vercel.app',
      'https://admin-pethub-rnc.vercel.app',
      'https://hotel-pethub-rnc.vercel.app',
      'https://vendor-pethub-rnc.vercel.app',
      'https://sitter-pethub-rnc.vercel.app',
      'https://school-pethub-rnc.vercel.app',
      'https://owner-pethub-rnc.vercel.app',
      'https://marketing-pethub-rnc.vercel.app',
    ],
    credentials: true,
  });

  // shutdown hooks
  app.enableShutdownHooks();

  // Swagger Setup
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Auto-add security to all endpoints
  document.paths = Object.fromEntries(
    Object.entries(document.paths).map(([path, ops]) => [
      path,
      Object.fromEntries(
        Object.entries(ops).map(([method, op]) => [
          method,
          {
            ...op,
            security: [{ 'access-token': [] }],
          },
        ])
      ),
    ])
  );

  SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);
  // Static files
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/uploads/',
  });

  app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT ? parseInt(process.env.PORT) : 7000;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port: ${port}`);
  });
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during application bootstrap', err.stack);
  process.exit(1);
});
