import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dtos/createPost.dto';
import { CommentDto } from './dtos/comment.dto';
import { Public } from '@app/common/public.decorator';
import { SearchDto } from './dtos/search.dto';

@Controller()
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('sendFriendRequest/:id')
  sendFriendRequest(@Req() req, @Param('id') id: string) {
    return this.communityService.sendFriendRequest(id, req);
  }
  @Post('acceptFriendRequest/:id')
  acceptFriendRequest(@Req() req, @Param('id') id: string) {
    return this.communityService.acceptFriendRequest(id, req);
  }
  @Post('rejectFriendRequest/:id')
  rejectFriendRequest(@Req() req, @Param('id') id: string) {
    return this.communityService.rejectFriendRequest(id, req);
  }
  @Post('unfriend/:id')
  unfriend(@Req() req, @Param('id') id: string) {
    return this.communityService.unfriend(id, req);
  }
  @Get('allSentFriendRequests')
  allSentFriendRequests(@Req() req) {
    return this.communityService.allSentFriendRequests(req);
  }
  @Get('allFriends')
  allFriends(@Req() req) {
    return this.communityService.allFriends(req);
  }
  @Post('createGroup')
  createGroup(@Req() req, @Body() createGroupDto: CreateGroupDto) {
    return this.communityService.createGroup(createGroupDto, req);
  }
  @Patch('updateGroup/:id')
  updateGroup(
    @Req() req,
    @Param('id') id: string,
    @Body() updateGroupDto: CreateGroupDto,
  ) {
    return this.communityService.updateGroup(updateGroupDto, id, req);
  }
  @Get('allMyGroups')
  allMyGroups(@Req() req) {
    return this.communityService.allMyGroups(req);
  }
  @Get('groupById/:id')
  groupById(@Param('id') id: string) {
    return this.communityService.groupById(id);
  }
  @Post('joinGroup/:id')
  joinGroup(@Param('id') id: string, @Req() req) {
    return this.communityService.joinGroup(id, req);
  }
  @Post('leaveGroup/:id')
  leaveGroup(@Param('id') id: string, @Req() req) {
    return this.communityService.leaveGroup(id, req);
  }
  @Post('postGroup/:id')
  @UseInterceptors(
    FilesInterceptor('images', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|avi|wmv)$/)) {
          return cb(
            new Error('Only image and video files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  postGroup(
    @UploadedFiles() images: any,
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.communityService.postGroup(createPostDto, id, req, images);
  }
  @Post('postProfile')
  @UseInterceptors(
    FilesInterceptor('images', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|avi|wmv)$/)) {
          return cb(
            new Error('Only image and video files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  postProfile(
    @UploadedFiles() images: any,
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    return this.communityService.postProfile(createPostDto, req, images);
  }
  @Delete('post/:id')
  deletePost(@Req() req, @Param('id') id: string) {
    return this.communityService.deletePost(id, req);
  }
  @Post('like/:id')
  like(@Param('id') id: string, @Req() req) {
    return this.communityService.like(id, req);
  }
  @Post('unlike/:id')
  unlike(@Param('id') id: string, @Req() req) {
    return this.communityService.unlike(id, req);
  }
  @Post('comment/:id')
  comment(@Param('id') id: string, @Req() req, @Body() commentDto: CommentDto) {
    return this.communityService.comment(commentDto, id, req);
  }
  @Delete('comment/:id')
  deleteComment(@Param('id') id: string, @Req() req) {
    return this.communityService.deleteComment(id, req);
  }
  @Get('feed')
  feed(@Req() req) {
    return this.communityService.feed(req);
  }
  @Public()
  @Get('postsById/:id')
  postsById(@Param('id') id: string) {
    return this.communityService.postsById(id);
  }
  @Get('recommendedGroups')
  recommendedGroups() {
    return this.communityService.recommendedGroups();
  }
  @Public()
  @Get('search')
  searsh(@Body() searchDto: SearchDto) {
    return this.communityService.search(searchDto);
  }
}
