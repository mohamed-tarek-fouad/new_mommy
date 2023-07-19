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
  @Get('userById')
  userById(@Req() req) {
    return this.usersService.userById(req);
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
  @Get('babyById/:id')
  babyById(@Param('id') id: string, @Req() req) {
    return this.usersService.babyById(id, req);
  }
  @Post('addMedicalRecord/:id')
  addMedicalRecord(
    @Param('id') id: string,
    @Body() addMedicaltDto: AddMedicalDto,
    @Req() req,
  ) {
    return this.usersService.addMedicalRecord(addMedicaltDto, id, req);
  }
  @Patch('updateMedicalRecord/:id')
  updateMedicalRecord(
    @Param('id') id: string,
    @Body() updateMedicaltDto: UpdateMedicalDto,
    @Req() req,
  ) {
    return this.usersService.updateMedicalRecord(updateMedicaltDto, id, req);
  }
  @Delete('medicalRecord/:id')
  deleteMedicalRecord(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteMedicalRecord(id, req);
  }
  @Get('medicalHistory/:babyId')
  medicalHistory(@Param('babyId') babyId: string, @Req() req) {
    return this.usersService.allRecords(babyId, req);
  }
  @Get('medicalRecord/:id')
  medicalRecordById(@Param('id') id: string, @Req() req) {
    return this.usersService.medicalRecordById(id, req);
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
    @UploadedFiles() images: any,
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.usersService.addMedicalDocument(images, id, req);
  }
  @Patch('updateMedicalDocument/:id')
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
    @UploadedFiles() images: any,
    @Req() req,
    @Param('id') id: string,
  ) {
    return this.usersService.updateMedicalDocument(images, id, req);
  }
  @Delete('document/:id')
  deleteDocument(@Req() req, @Param('id') id: string) {
    return this.usersService.deleteDocument(id, req);
  }
  @Get('allDocuments/:id')
  allDocuments(@Req() req, @Param('id') id: string) {
    return this.usersService.allDocuments(id, req);
  }
  @Get('documentById/:id')
  documentById(@Param('id') id: string, @Req() req) {
    return this.usersService.documentById(id, req);
  }
  @Post('addActivity/:id')
  addActivity(
    @Body() addActivityDto: AddActivityDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.addActivity(addActivityDto, id, req);
  }
  @Patch('updateActivity/:id')
  updateActivity(
    @Body() updateActivityDto: UpdateActivityDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.updateActivity(updateActivityDto, id, req);
  }
  @Delete('activity/:id')
  deleteActivity(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteActivity(id, req);
  }
  @Get('activities/:babyId')
  allActivities(@Param('babyId') babyId: string, @Req() req) {
    return this.usersService.allActivities(babyId, req);
  }
  @Get('activityById/:babyId/:id')
  activitybyId(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.activityById(babyId, id, req);
  }
  @Post('addMeal/:id')
  addMeal(
    @Body() addFeedingDto: AddFeedingDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.addMeal(addFeedingDto, id, req);
  }
  @Patch('updateMeal/:id')
  updateMeal(
    @Body() updateFeedingDto: UpdateFeedingDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.updateMeal(updateFeedingDto, id, req);
  }
  @Delete('meal/:id')
  deleteMeal(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteMeal(id, req);
  }
  @Get('meals/:babyId')
  allMeals(@Param('babyId') babyId: string, @Req() req) {
    return this.usersService.allMeals(babyId, req);
  }
  @Get('mealById/:babyId/:id')
  mealbyId(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.mealById(babyId, id, req);
  }
  @Post('addGrowthMilestone/:id')
  addGrowth(
    @Body() addGrowthDto: AddGrowthDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.addGrowth(addGrowthDto, id, req);
  }
  @Patch('updateGrowthMilestone/:id')
  updateGrowth(
    @Body() updateGrowthDto: updateGrowthDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.updateGrowth(updateGrowthDto, id, req);
  }
  @Delete('growthMilestone/:id')
  deleteGrowth(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteGrowth(id, req);
  }
  @Get('growthMilestones/:babyId')
  allGrowth(@Param('babyId') babyId: string, @Req() req) {
    return this.usersService.allGrowth(babyId, req);
  }
  @Get('growthMilestoneById/:babyId/:id')
  growthMilestonebyId(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.growthById(babyId, id, req);
  }
  @Post('addFirst/:id')
  addFirst(
    @Body() addFirstDto: AddFirstDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.addFirst(addFirstDto, id, req);
  }
  @Patch('updateFirst/:id')
  updateFirsts(
    @Body() updateFirstDto: UpdateFirstDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.updateFirst(updateFirstDto, id, req);
  }
  @Delete('first/:id')
  deleteFirst(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteFirst(id, req);
  }
  @Get('allFirsts/:babyId')
  allFirsts(@Param('babyId') babyId: string, @Req() req) {
    return this.usersService.allFirsts(babyId, req);
  }
  @Get('firstById/:babyId/:id')
  firstbyId(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.firstById(babyId, id, req);
  }
  @Post('addReminder/:id')
  addReminder(
    @Body() addReminderDto: AddReminderDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.addReminder(addReminderDto, id, req);
  }
  @Patch('updateReminder/:id')
  updateReminders(
    @Body() updateReminderDto: UpdateReminderDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.updateReminder(updateReminderDto, id, req);
  }
  @Delete('reminder/:id')
  deleteReminder(@Param('id') id: string, @Req() req) {
    return this.usersService.deleteReminder(id, req);
  }
  @Get('allReminders/:babyId')
  allReminders(@Param('babyId') babyId: string, @Req() req) {
    return this.usersService.allReminders(babyId, req);
  }
  @Get('reminderById/:babyId/:id')
  reminderbyId(
    @Param('babyId') babyId: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.usersService.reminderById(babyId, id, req);
  }
}
