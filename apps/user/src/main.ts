import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import * as dotenv from 'dotenv';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
dotenv.config();

async function bootstrap() {
  // Create an HTTPS server for the microservice
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  };
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      UserModule,
      microserviceOptions,
    );
  await microservice.listen();
  Logger.log('User Microservice Is Running');
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
  await api.listen(process.env.USER_PORT);
  Logger.log('User API Is Running');
}

bootstrap();
