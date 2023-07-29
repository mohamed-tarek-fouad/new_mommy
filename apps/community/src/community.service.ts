import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { MessageDto } from './dtos/message.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { CreateGroupDto } from './dtos/createGroup.dto';
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
  async sendFriendRequest(id: string, req) {
    try {
      const previusFriendRequest = await this.prisma.friendRequest.findFirst({
        where: {
          OR: [
            { user1Id: req.user.id, user2Id: id },
            { user1Id: id, user2Id: req.user.id },
          ],
        },
      });
      if (previusFriendRequest) {
        return { message: 'request already sent' };
      }
      const friendRequest = await this.prisma.friendRequest.create({
        data: { user1Id: req.user.id, user2Id: id },
      });
      return {
        message: 'request sent successfully',
        friendRequest,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async acceptFriendRequest(id: string, req) {
    try {
      const friendRequest = await this.prisma.friendRequest.findFirst({
        where: { id, user2Id: req.user.id },
      });
      const friend = await this.prisma.friends.create({
        data: {
          friend1Id: friendRequest.user1Id,
          friend2Id: friendRequest.user2Id,
        },
      });
      await this.prisma.friendRequest.deleteMany({
        where: { id, user2Id: req.user.id },
      });
      return { message: 'friend request accepted successfully', friend };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async rejectFriendRequest(id: string, req) {
    try {
      await this.prisma.friendRequest.deleteMany({
        where: { id, user2Id: req.user.id },
      });
      return { message: 'deleted friend request successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async unfriend(id: string, req) {
    try {
      await this.prisma.friends.deleteMany({
        where: {
          OR: [
            { id, friend1Id: req.user.id },
            { id, friend2Id: req.user.id },
          ],
        },
      });
      return { message: 'unfriended successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async allSentFriendRequests(req) {
    try {
      const allFriendRequests = await this.prisma.friendRequest.findMany({
        where: { user2Id: req.user.id },
      });
      return { message: 'all friend requests', allFriendRequests };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async allFriends(req) {
    try {
      const allFriends = await this.prisma.friends.findMany({
        where: { OR: [{ friend1Id: req.user.id }, { friend2Id: req.user.id }] },
      });
      const friendsIds = [];
      allFriends.forEach((friend) => {
        if (req.user.id !== friend.friend1Id) {
          friendsIds.push(friend.friend1Id);
        } else {
          friendsIds.push(friend.friend2Id);
        }
      });
      const friendList = await this.prisma.users.findMany({
        where: { id: { in: friendsIds } },
      });
      return { message: 'friend list', friendList };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async createGroup(createGroupDto: CreateGroupDto, req) {
    try {
      const group = await this.prisma.groups.create({
        data: { ...createGroupDto, founder: req.user.id },
      });
      await this.prisma.userGroup.create({
        data: { usersId: req.user.id, groupId: group.id },
      });
      return { message: 'created group successfully', group };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async updateGroup(updateGroupDto: CreateGroupDto, id: string, req) {
    try {
      await this.prisma.groups.updateMany({
        where: { id, founder: req.user.id },
        data: updateGroupDto,
      });
      const group = await this.prisma.groups.findFirst({
        where: { id, founder: req.user.id },
      });
      return { message: 'group updated successfully', group };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async allMyGroups(req) {
    try {
      const groups = await this.prisma.userGroup.findMany({
        where: { usersId: req.user.id },
        include: { group: true },
      });
      return { message: 'all groups retrieved successfully', groups };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async groupById(id: string) {
    try {
      const group = await this.prisma.userGroup.findMany({
        where: { groupId: id },
      });
      return { message: 'group retrieved successfully', group };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async joinGroup(id: string, req) {
    try {
      await this.prisma.userGroup.create({
        data: { usersId: req.user.id, groupId: id },
      });
      return { message: 'joined group successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async leaveGroup(id: string, req) {
    try {
      await this.prisma.userGroup.deleteMany({
        where: { id, usersId: req.user.id },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
