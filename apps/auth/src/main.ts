import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
dotenv.config();

async function bootstrap() {
  const key = fs.readFileSync('apps/auth/src/key.pem');
  const keyHex = Buffer.from(key);
  const cert = fs.readFileSync('apps/auth/src/cert.pem');
  const certHex = Buffer.from(cert);
  const chain = fs.readFileSync('apps/auth/src/fullchain.pem');
  const chainHex = Buffer.from(chain);
  // Create an HTTPS server for the API
  const apiOptions = {
    httpsOptions: {
      key: keyHex,
      cert: certHex,
      ca: [chainHex],
    },
  };
  const api = await NestFactory.create(AppModule, {
    httpsOptions: apiOptions.httpsOptions as HttpsOptions,
  });
  api.setGlobalPrefix('/api');
  api.enableCors();
  api.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await api.listen(process.env.PORT);
  Logger.log('Auth API Is Running');
}

bootstrap();
