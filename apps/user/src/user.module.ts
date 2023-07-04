import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '@app/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AtStrategy } from '@app/common/at.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, AtStrategy, ConfigService],
})
export class UserModule {}
