import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.PORT ?? 3000;
const host = process.env.HOST ?? '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGIN
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, host);
}
void bootstrap();
