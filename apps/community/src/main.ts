import { NestFactory } from '@nestjs/core';
import { CommunityModule } from './community.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommunityModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URI],
        queue: 'community_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
  Logger.log('User Microservice Is Running');
  const appApi = await NestFactory.create(AppModule);
  appApi.setGlobalPrefix('/api');
  appApi.enableCors();
  appApi.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await appApi.listen(process.env.PORT);
  Logger.log('Community API Is Running');
}
bootstrap();
