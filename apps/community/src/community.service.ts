import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { MessageDto } from './dtos/message.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { CreatePostDto } from './dtos/createPost.dto';
import { v2 as cloudinary } from 'cloudinary';
import { CommentDto } from './dtos/comment.dto';
import { SearchDto } from './dtos/search.dto';
@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }
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
      const friend = await this.prisma.friends.findFirst({
        where: {
          OR: [
            { friend1Id: id, friend2Id: req.user.id },
            { friend1Id: req.user.id, friend2Id: id },
          ],
        },
      });
      if (previusFriendRequest || friend) {
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
        where: { user1Id: id, user2Id: req.user.id },
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
            { friend2Id: id, friend1Id: req.user.id },
            { friend1Id: id, friend2Id: req.user.id },
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
        data: { ...updateGroupDto },
      });
      // const imageToDelete = await this.prisma.groups.findUnique({
      //   where: { id },
      // });
      // const publicId = imageToDelete.image.split('/').pop().split('.')[0];
      // await cloudinary.uploader.destroy(publicId, (error) => {
      //   if (error) {
      //     throw new HttpException(error, HttpStatus.BAD_REQUEST);
      //   }
      // });
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
  async groupById(id: string, req) {
    try {
      const group = await this.prisma.groups.findUnique({
        where: { id },
      });
      const userInGroup = await this.prisma.userGroup.findFirst({
        where: { usersId: req.user.id, groupId: id },
      });

      const posts = await this.prisma.posts.findMany({
        where: { groupId: id },
        include: {
          likes: { select: { usersId: true } },
          comments: true,
        },
        orderBy: { time: 'desc' },
      });
      const isFriend = userInGroup ? true : false;
      const updatedPosts = posts.map((post) => {
        const userExistsInLikes = post.likes.some(
          (like) => like.usersId === req.user.id,
        );

        return {
          ...post,
          userExistsInLikes,

          likes: undefined, // Remove the 'likes' property
        };
      });
      return {
        message: 'retrieved all posts successfully',
        posts: updatedPosts,
        userExistsInGroup: isFriend,
        group,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async joinGroup(id: string, req) {
    const userGroup = await this.prisma.userGroup.findFirst({
      where: { groupId: id, usersId: req.user.id },
    });
    if (userGroup)
      throw new HttpException('you already joined', HttpStatus.BAD_REQUEST);
    await this.prisma.userGroup.create({
      data: { usersId: req.user.id, groupId: id },
    });
    await this.prisma.groups.update({
      where: { id },
      data: { count: { increment: 1 } },
    });
    return { message: 'joined group successfully' };
  }
  async leaveGroup(id: string, req) {
    try {
      const userGroup = await this.prisma.userGroup.findFirst({
        where: { groupId: id, usersId: req.user.id },
      });
      if (!userGroup)
        throw new HttpException('you already left', HttpStatus.BAD_REQUEST);
      await this.prisma.userGroup.deleteMany({
        where: { groupId: id, usersId: req.user.id },
      });
      await this.prisma.groups.update({
        where: { id },
        data: { count: { decrement: 1 } },
      });
      return { message: 'left group successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadImage(buffer: Buffer): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          })
          .end(buffer);
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async postGroup(createPostDto: CreatePostDto, id: string, req, images) {
    try {
      const url = images[0] ? await this.uploadImage(images[0].buffer) : null;
      const post = await this.prisma.posts.create({
        data: {
          ...createPostDto,
          groupId: id,
          usersId: req.user.id,
          media: url,
          time: new Date().toISOString(),
        },
      });
      return { message: 'post created successfully', post };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async postProfile(createPostDto: CreatePostDto, req, images) {
    try {
      const url = images[0] ? await this.uploadImage(images[0].buffer) : null;
      const post = await this.prisma.posts.create({
        data: {
          ...createPostDto,
          usersId: req.user.id,
          media: url,
          time: new Date().toISOString(),
        },
      });
      return { message: 'post created successfully', post };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async deletePost(id: string, req) {
    try {
      const imageToDelete = await this.prisma.posts.findFirst({
        where: { id, usersId: req.user.id },
      });
      const publicId = imageToDelete.media?.split('/').pop().split('.')[0];
      publicId
        ? await cloudinary.uploader.destroy(publicId, (error) => {
            if (error) {
              throw new HttpException(error, HttpStatus.BAD_REQUEST);
            }
          })
        : null;
      await this.prisma.posts.deleteMany({
        where: {
          id,
          usersId: req.user.id,
        },
      });
      return { message: 'post deleted successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async like(id: string, req) {
    const like = await this.prisma.likes.findFirst({
      where: { usersId: req.user.id, postId: id },
    });
    if (like)
      throw new HttpException(
        'you have already liked this post',
        HttpStatus.BAD_REQUEST,
      );
    await this.prisma.likes.create({
      data: { usersId: req.user.id, postId: id },
    });
    await this.prisma.posts.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
    return { message: 'liked successfully' };
  }
  async unlike(id: string, req) {
    const like = await this.prisma.likes.findFirst({
      where: { usersId: req.user.id, postId: id },
    });

    if (!like)
      throw new HttpException(
        'you have not liked this post',
        HttpStatus.BAD_REQUEST,
      );
    await this.prisma.likes.deleteMany({
      where: { postId: id, usersId: req.user.id },
    });

    await this.prisma.posts.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    });
    return { message: 'disliked successfully' };
  }
  async comment(commentDto: CommentDto, id: string, req) {
    try {
      const comment = await this.prisma.comments.create({
        data: { ...commentDto, postId: id, usersId: req.user.id },
      });
      await this.prisma.posts.update({
        where: { id },
        data: { commentCount: { increment: 1 } },
      });
      return { message: 'comment added successfully', comment };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteComment(id: string, req) {
    try {
      const comment = await this.prisma.comments.findUnique({ where: { id } });
      if (!comment)
        throw new HttpException(
          'there is no comment with this id',
          HttpStatus.BAD_REQUEST,
        );
      await this.prisma.comments.deleteMany({
        where: {
          id,
          usersId: req.user.id,
        },
      });
      await this.prisma.posts.update({
        where: { id },
        data: { commentCount: { decrement: 1 } },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async feed(req) {
    try {
      const posts = await this.prisma.posts.findMany({
        include: {
          Users: {
            select: {
              firstname: true,
              lastname: true,
              image: true,
              id: true,
              cover: true,
            },
          },
          likes: { select: { usersId: true } },
          comments: true,
          group: { select: { groupName: true } },
        },
        orderBy: { time: 'desc' },
      });
      const updatedPosts = posts.map((post) => {
        const userExistsInLikes = post.likes.some(
          (like) => like.usersId === req.user.id,
        );

        return {
          ...post,
          userExistsInLikes,

          likes: undefined, // Remove the 'likes' property
        };
      });
      return {
        message: 'all feed retreived successfully',
        posts: updatedPosts,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async postsById(id: string, req) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        select: {
          firstname: true,
          lastname: true,
          image: true,
          cover: true,
          id: true,
        },
      });
      const friend = await this.prisma.friends.findFirst({
        where: { OR: [{ friend1Id: id }, { friend2Id: id }] },
      });

      const posts = await this.prisma.posts.findMany({
        where: { usersId: id },
        include: {
          likes: { select: { usersId: true } },
          comments: true,
        },
        orderBy: { time: 'desc' },
      });
      const isFriend = friend ? true : false;
      const updatedPosts = posts.map((post) => {
        const userExistsInLikes = post.likes.some(
          (like) => like.usersId === req.user.id,
        );

        return {
          ...post,
          userExistsInLikes,

          likes: undefined, // Remove the 'likes' property
        };
      });
      return {
        message: 'retrieved all posts successfully',
        posts: updatedPosts,
        userExistsInFriends: isFriend,
        user,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async myProfile(req) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: req.user.id },
        select: {
          firstname: true,
          lastname: true,
          image: true,
          cover: true,
          id: true,
        },
      });

      const posts = await this.prisma.posts.findMany({
        where: { usersId: req.user.id },
        include: {
          likes: { select: { usersId: true } },
          comments: true,
        },
        orderBy: { time: 'desc' },
      });
      return { message: 'retrieved all posts successfully', posts, user };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async recommendedGroups() {
    try {
      const groups = await this.prisma.groups.findMany({
        take: 10,
        include: { UserGroup: { select: { usersId: true } } },
      });

      return { message: 'groups retrieved successfully', groups };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async search(searchDto: SearchDto) {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          OR: [
            { firstname: { contains: searchDto.searchText } },
            { lastname: { contains: searchDto.searchText } },
          ],
        },
      });
      const groups = await this.prisma.groups.findMany({
        where: { groupName: { contains: searchDto.searchText } },
      });
      return { message: 'results are as following', users, groups };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadProfileImage(req, images) {
    try {
      const url = images[0] ? await this.uploadImage(images[0].buffer) : '';

      await this.prisma.users.update({
        where: { id: req.user.id },
        data: { image: url },
      });
      return {
        message: 'profile updated successfully',
        profileImage: url,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadProfileCover(req, images) {
    try {
      const url = images[0] ? await this.uploadImage(images[0].buffer) : '';

      await this.prisma.users.update({
        where: { id: req.user.id },
        data: { cover: url },
      });
      return {
        message: 'profile updated successfully',
        profileImage: url,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadGroupCover(req, images, id: string) {
    try {
      const url = images[0] ? await this.uploadImage(images[0].buffer) : '';

      await this.prisma.groups.updateMany({
        where: { id, founder: req.user.id },
        data: { cover: url },
      });
      return {
        message: 'group updated successfully',
        profileImage: url,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadGroupImage(req, images, id: string) {
    try {
      const url = images[0] ? await this.uploadImage(images[0].buffer) : '';

      await this.prisma.groups.updateMany({
        where: { id, founder: req.user.id },
        data: { image: url },
      });
      return {
        message: 'group updated successfully',
        profileImage: url,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
