import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommunityService } from './community.service';
import { MessageDto } from './dtos/message.dto';
import { Req } from '@nestjs/common';
@WebSocketGateway()
export class CommunityGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private communityService: CommunityService) {}
  @WebSocketServer()
  server: any;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string): void {
    client.join(roomId);
    client.emit('roomJoined', roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    @Req() req,
    messageDto: MessageDto,
    roomId: string,
  ): Promise<void> {
    await this.communityService.createMessage(messageDto, req);
    this.server.to(roomId).emit('recMessage', messageDto);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('User connected', client, args);
  }

  handleDisconnect(client: any) {
    console.log('User disconnected', client);
  }

  afterInit(server: any) {
    console.log('Socket is live', server);
  }
}
