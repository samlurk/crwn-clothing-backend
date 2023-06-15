import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const host = configService.get('host');

  app.enableCors({
    origin: configService.get('CorsOrigin')
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, host);
}
void bootstrap();
