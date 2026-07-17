import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // Local astro dev (yarn dev) talks to the brain directly, bypassing the CF Worker
  app.enableCors({ origin: ['http://localhost:4321'] });

  const port = Number(process.env.BRAIN_PORT || 3123);
  const host = process.env.BRAIN_HOST || '127.0.0.1';
  await app.listen(port, host);

  const logger = new Logger('AetheryBrain');
  logger.log(`Aethery brain listening on ${host}:${port}`);
  if (!process.env.BRAIN_SECRET) {
    logger.warn('BRAIN_SECRET not set — accepting unauthenticated requests (dev mode)');
  }
}
bootstrap();
