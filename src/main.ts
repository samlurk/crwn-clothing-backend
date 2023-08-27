import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port: string | undefined = configService.get('port');
  const host: string | undefined = configService.get('host');

  app.enableCors({
    origin: configService.get('corsOrigin')
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port ?? 3000, host ?? '0.0.0.0');
}
void bootstrap();
