import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { MessageDto } from './dtos/message.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}
  async createMessage(messageDto: MessageDto, req): Promise<void> {
    try {
      const username = await this.prisma.users.findUnique({
        where: { id: req.user.id },
      });
      await this.prisma.messages.create({
        data: {
          ...messageDto,
          sender: username.firstname + ' ' + username.lastname,
        },
      });
      return;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
