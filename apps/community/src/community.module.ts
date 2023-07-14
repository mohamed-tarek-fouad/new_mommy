import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { PrismaService } from '@app/common';
import { AtStrategy } from '@app/common/at.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [CommunityController],
  providers: [CommunityService, PrismaService, AtStrategy, ConfigService],
})
export class CommunityModule {}
