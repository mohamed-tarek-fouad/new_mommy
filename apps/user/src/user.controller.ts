import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Delete,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BabyDto } from './dtos/babydto';
import { UpdateBabyListDto } from './dtos/deleteUpdateBaby.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}
  @Get()
  allUsers() {
    return this.usersService.allUsers();
  }
  @Get(':id')
  userById(@Param('id') id: string) {
    return this.usersService.userById(id);
  }
  @Post('addBaby')
  @UseInterceptors(
    FilesInterceptor('images', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  addBaby(@Body() babyDto: BabyDto, @Req() req, @UploadedFiles() images: any) {
    console.log(req.user);
    return this.usersService.addBaby(babyDto, req, images);
  }
  @Delete('deleteBaby')
  deleteBaby(@Body() babyDto: BabyDto, @Req() req) {
    return this.usersService.deleteBaby(babyDto, req);
  }
  @Patch('updateBaby')
  updateBaby(@Body() babyDto: UpdateBabyListDto, @Req() req) {
    return this.usersService.updateBaby(babyDto, req);
  }
}
