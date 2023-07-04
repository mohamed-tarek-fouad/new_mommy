import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@app/common/at.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
