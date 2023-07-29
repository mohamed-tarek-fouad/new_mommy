import { Controller, Get, Param, Post, Req, Body, Patch } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateGroupDto } from './dtos/createGroup.dto';

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
}
