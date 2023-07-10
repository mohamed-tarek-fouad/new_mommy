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
import { UpdateBabyDto } from './dtos/updateBaby.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddMedicalDto } from './dtos/addMedicalDocument';
import { UpdateMedicalDto } from './dtos/updateMedicalDocument';
import { AddActivityDto } from './dtos/addActivity.dto';
import { UpdateActivityDto } from './dtos/updateActivity.dto';
import { AddFeedingDto } from './dtos/addFeeding.dto';
import { UpdateFeedingDto } from './dtos/updateFeeding.dto';
import { AddGrowthDto } from './dtos/addGrowthMilestone.dto';
import { updateGrowthDto } from './dtos/updateGrowthMilestone.dto';
import { AddFirstDto } from './dtos/addFirst.dto';
import { UpdateFirstDto } from './dtos/updateFirst.dto';
import { AddReminderDto } from './dtos/addReminder.dto';
import { UpdateReminderDto } from './dtos/updateReminder.dto';
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
    return this.usersService.addBaby(babyDto, req, images);
  }
  @Delete('deleteBaby/:id')
  deleteBaby(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteBaby(id, req);
  }
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
  @Patch('updateBaby/:id')
  updateBaby(
    @Body() babyDto: UpdateBabyDto,
    @Req() req,
    @Param('id') id: string,
    @UploadedFiles() images: any,
  ) {
    return this.usersService.updateBaby(babyDto, req, id, images);
  }
  @Post('addMedicalDocument/:id')
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
  addMedicalDocument(
    @Param('id') id: string,
    @UploadedFiles() images: any,
    @Body() addMedicaltDto: AddMedicalDto,
  ) {
    return this.usersService.addMedicalDocument(addMedicaltDto, id, images);
  }
  @Post('updateMedicalDocument/:id')
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
  updateMedicalDocument(
    @Param('id') id: string,
    @UploadedFiles() images: any,
    @Body() updateMedicaltDto: UpdateMedicalDto,
  ) {
    return this.usersService.updateMedicalDocument(
      updateMedicaltDto,
      id,
      images,
    );
  }
  @Delete('medicalDocument/:id')
  deleteMedicalDocument(@Param('id') id: string) {
    return this.usersService.deleteMedicalDocument(id);
  }
  @Get('medicalHistory/:babyId')
  medicalHistory(@Param('babyId') babyId: string) {
    return this.usersService.allDocuments(babyId);
  }
  @Get('medicalDocument/:babyId/:id')
  medicalDocumentById(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.medicalDocumentById(babyId, id);
  }
  @Post('addActivity/:id')
  addActivity(@Body() addActivityDto: AddActivityDto, @Param('id') id: string) {
    return this.usersService.addActivity(addActivityDto, id);
  }
  @Patch('updateActivity/:id')
  updateActivity(
    @Body() updateActivityDto: UpdateActivityDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateActivity(updateActivityDto, id);
  }
  @Delete('activity/:id')
  deleteActivity(@Param('id') id: string) {
    return this.usersService.deleteActivity(id);
  }
  @Get('activities/:babyId')
  allActivities(@Param('babyId') babyId: string) {
    return this.usersService.allActivities(babyId);
  }
  @Get('activityById/:babyId/:id')
  activitybyId(@Param('babyId') babyId: string, @Param('id') id: string) {
    return this.usersService.activityById(babyId, id);
  }
  @Post('addMeal/:id')
  addMeal(@Body() addFeedingDto: AddFeedingDto, @Param('id') id: string) {
    return this.usersService.addMeal(addFeedingDto, id);
  }
  @Patch('updateMeal/:id')
  updateMeal(
    @Body() updateFeedingDto: UpdateFeedingDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateMeal(updateFeedingDto, id);
  }
  @Delete('meal/:id')
  deleteMeal(@Param('id') id: string) {
    return this.usersService.deleteMeal(id);
  }
  @Get('meals/:babyId')
  allMeals(@Param('babyId') babyId: string) {
    return this.usersService.allMeals(babyId);
  }
  @Get('mealById/:babyId/:id')
  mealbyId(@Param('babyId') babyId: string, @Param('id') id: string) {
    return this.usersService.mealById(babyId, id);
  }
  @Post('addGrowthMilestone/:id')
  addGrowth(@Body() addGrowthDto: AddGrowthDto, @Param('id') id: string) {
    return this.usersService.addGrowth(addGrowthDto, id);
  }
  @Patch('updateGrowthMilestone/:id')
  updateGrowth(
    @Body() updateGrowthDto: updateGrowthDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateGrowth(updateGrowthDto, id);
  }
  @Delete('growthMilestone/:id')
  deleteGrowth(@Param('id') id: string) {
    return this.usersService.deleteGrowth(id);
  }
  @Get('growthMilestones/:babyId')
  allGrowth(@Param('babyId') babyId: string) {
    return this.usersService.allGrowth(babyId);
  }
  @Get('growthMilestoneById/:babyId/:id')
  growthMilestonebyId(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.growthById(babyId, id);
  }
  @Post('addFirst/:id')
  addFirst(@Body() addFirstDto: AddFirstDto, @Param('id') id: string) {
    return this.usersService.addFirst(addFirstDto, id);
  }
  @Patch('updateFirst/:id')
  updateFirsts(
    @Body() updateFirstDto: UpdateFirstDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateFirst(updateFirstDto, id);
  }
  @Delete('First/:id')
  deleteFirst(@Param('id') id: string) {
    return this.usersService.deleteFirst(id);
  }
  @Get('allFirsts/:babyId')
  allFirsts(@Param('babyId') babyId: string) {
    return this.usersService.allFirsts(babyId);
  }
  @Get('firstById/:babyId/:id')
  firstbyId(@Param('babyId') babyId: string, @Param('id') id: string) {
    return this.usersService.firstById(babyId, id);
  }
  @Post('addReminder/:id')
  addReminder(@Body() addReminderDto: AddReminderDto, @Param('id') id: string) {
    return this.usersService.addReminder(addReminderDto, id);
  }
  @Patch('updateReminder/:id')
  updateReminders(
    @Body() updateReminderDto: UpdateReminderDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateReminder(updateReminderDto, id);
  }
  @Delete('Reminder/:id')
  deleteReminder(@Param('id') id: string) {
    return this.usersService.deleteReminder(id);
  }
  @Get('allReminders/:babyId')
  allReminders(@Param('babyId') babyId: string) {
    return this.usersService.allReminders(babyId);
  }
  @Get('reminderById/:babyId/:id')
  reminderbyId(@Param('babyId') babyId: string, @Param('id') id: string) {
    return this.usersService.reminderById(babyId, id);
  }
}
