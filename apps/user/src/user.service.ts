import { PrismaService } from '@app/common';
import {
  Injectable,
  HttpException,
  HttpStatus,
  // Inject,
  // CACHE_MANAGER,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { BabyDto } from './dtos/babydto';
import { UpdateBabyDto } from './dtos/updateBaby.dto';
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
// import { Cache } from 'cache-manager';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }
  async allUsers() {
    // const isCached = await this.cacheManager.get('users');
    // if (isCached) {
    //   return { isCached, message: 'fetched all users successfully' };
    // }
    const user = await this.prisma.users.findMany({});
    if (user.length === 0) {
      throw new HttpException('there is no users', HttpStatus.BAD_REQUEST);
    }
    // await this.cacheManager.set('users', user);
    return { ...user, message: 'fetched all users successfully' };
  }

  async userById(id: string) {
    // const isCached = await this.cacheManager.get(`user${id}`);
    // if (isCached) {
    //   return { isCached, message: 'fetched all users successfully' };
    // }
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(
        "this user does'nt exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    delete user.password;
    // await this.cacheManager.set(`user${id}`, {
    //   ...user,
    // });
    return { ...user, message: 'user fetched successfully' };
  }
  async uploadImage(buffer: Buffer): Promise<string> {
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
  }
  async addBaby(babyDto: BabyDto, req, image) {
    const today = new Date();

    // Parse the birth date string and create a Date object
    const birthdate = new Date(babyDto.birthDate);

    // Calculate the person's age in years
    let age = today.getFullYear() - birthdate.getFullYear();
    if (
      birthdate.getMonth() > today.getMonth() ||
      (birthdate.getMonth() === today.getMonth() &&
        birthdate.getDate() > today.getDate())
    ) {
      age--;
    }
    if (age >= 5) {
      throw new HttpException(
        'max age supported less than 5 years',
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = image ? await this.uploadImage(image[0].buffer) : null;
    const user = await this.prisma.baby.create({
      data: {
        ...babyDto,
        image: url,
        usersId: req.user.id,
        weight: parseInt(babyDto.weight),
      },
    });
    return { user, message: 'updated babies successfully' };
  }
  async deleteBaby(id: string, req) {
    await this.prisma.baby.deleteMany({
      where: {
        usersId: req.user.id,
        id,
      },
    });
    return { message: 'deleted baby successfully' };
  }
  async updateBaby(babyDto: UpdateBabyDto, req, id: string, images) {
    const url = images ? await this.uploadImage(images[0].buffer) : null;
    const imageToDelete = await this.prisma.baby.findUnique({ where: { id } });
    const publicId = imageToDelete.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error(error);
      }
    });
    const baby = await this.prisma.baby.updateMany({
      where: {
        id,
        usersId: req.user.id,
      },
      data: { ...babyDto, image: url },
    });
    return { baby, message: 'updated babies successfully' };
  }
  async addMedicalDocument(addMedicalDto: AddMedicalDto, id: string, images) {
    const url = images ? await this.uploadImage(images[0].buffer) : null;
    const medicalDocument = await this.prisma.medicalHistory.create({
      data: { ...addMedicalDto, babyId: id, document: url },
    });
    return { message: 'added medical document successfully', medicalDocument };
  }
  async updateMedicalDocument(
    updateMedicalDto: UpdateMedicalDto,
    id: string,
    images,
  ) {
    const imageToDelete = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
    const publicId = imageToDelete.document.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error(error);
      }
    });
    const url = images ? await this.uploadImage(images[0].buffer) : null;
    const document = await this.prisma.medicalHistory.update({
      where: { id },
      data: { ...updateMedicalDto, document: url },
    });
    return { message: 'updated medical document successfully', document };
  }
  async deleteMedicalDocument(id: string) {
    const imageToDelete = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
    const publicId = imageToDelete.document.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error(error);
      }
    });
    await this.prisma.medicalHistory.delete({
      where: { id },
    });
    return { message: 'medical record deleted successfully' };
  }
  async allDocuments(babyId: string) {
    const medicalHistory = await this.prisma.medicalHistory.findMany({
      where: { babyId },
    });
    return { message: 'all medical history', medicalHistory };
  }
  async medicalDocumentById(babyId: string, id: string) {
    const medicalDocument = await this.prisma.medicalHistory.findFirst({
      where: { babyId, id },
    });
    return { message: 'all medical history', medicalDocument };
  }
  async addActivity(addActivityDto: AddActivityDto, id: string) {
    const activity = await this.prisma.activities.create({
      data: { ...addActivityDto, babyId: id },
    });
    return { message: 'added new activity successfully', activity };
  }
  async updateActivity(updateActivityDto: UpdateActivityDto, id: string) {
    const activity = await this.prisma.activities.update({
      where: { id },
      data: updateActivityDto,
    });
    return { message: 'updated Activity sucessfully', activity };
  }
  async deleteActivity(id: string) {
    await this.prisma.activities.delete({
      where: { id },
    });
    return { message: 'deleted Activity' };
  }
  async allActivities(babyId: string) {
    const activities = await this.prisma.activities.findMany({
      where: { babyId },
    });
    return { message: 'all activities retrieved successfully', activities };
  }
  async activityById(babyId: string, id: string) {
    const activity = await this.prisma.activities.findFirst({
      where: { babyId, id },
    });
    return { message: 'retrieved activity successfully', activity };
  }
  async addMeal(addFeedingDto: AddFeedingDto, id: string) {
    const meal = await this.prisma.feeding.create({
      data: { ...addFeedingDto, babyId: id },
    });
    return { message: 'added meal successfully', meal };
  }
  async updateMeal(updateMealDto: UpdateFeedingDto, id: string) {
    const meal = await this.prisma.feeding.update({
      where: { id },
      data: updateMealDto,
    });
    return { message: 'meal updated successfully', meal };
  }
  async deleteMeal(id: string) {
    await this.prisma.feeding.delete({ where: { id } });
    return { message: 'meal deleted successfully' };
  }
  async allMeals(babyId: string) {
    const meals = await this.prisma.feeding.findMany({
      where: { babyId },
    });
    return { message: 'all meals retrieved successfully', meals };
  }
  async mealById(babyId: string, id: string) {
    const meal = await this.prisma.feeding.findFirst({
      where: { babyId, id },
    });
    return { message: 'retrieved meal successfully', meal };
  }
  async addGrowth(addGrowthDto: AddGrowthDto, id: string) {
    const growthMilestone = await this.prisma.growth.create({
      data: {
        ...addGrowthDto,
        babyId: id,
        height: parseInt(addGrowthDto.height),
        weight: parseInt(addGrowthDto.weight),
      },
    });
    return { message: 'added growth milestone successfully', growthMilestone };
  }
  async updateGrowth(updateGrowthDto: updateGrowthDto, id: string) {
    const growthMilestone = await this.prisma.growth.update({
      where: { id },
      data: {
        ...updateGrowthDto,
        height: parseInt(updateGrowthDto.height),
        weight: parseInt(updateGrowthDto.weight),
      },
    });
    return {
      message: 'growth milestone updated successfully',
      growthMilestone,
    };
  }
  async deleteGrowth(id: string) {
    await this.prisma.growth.delete({ where: { id } });
    return { message: 'growth milestone deleted successfully' };
  }
  async allGrowth(babyId: string) {
    const growthMilestones = await this.prisma.growth.findMany({
      where: { babyId },
    });
    return {
      message: 'all growth milestones retrieved successfully',
      growthMilestones,
    };
  }
  async growthById(babyId: string, id: string) {
    const growthMilestone = await this.prisma.growth.findFirst({
      where: { babyId, id },
    });
    return {
      message: 'retrieved growth milestone successfully',
      growthMilestone,
    };
  }
  async addFirst(addFirstDto: AddFirstDto, id: string) {
    const first = await this.prisma.firsts.create({
      data: { ...addFirstDto, babyId: id },
    });
    return { message: 'added first successfully', first };
  }
  async updateFirst(updateFirstDto: UpdateFirstDto, id: string) {
    const first = await this.prisma.firsts.update({
      where: { id },
      data: updateFirstDto,
    });
    return { message: 'first updated successfully', first };
  }
  async deleteFirst(id: string) {
    await this.prisma.firsts.delete({ where: { id } });
    return { message: 'first deleted successfully' };
  }
  async allFirsts(babyId: string) {
    const firsts = await this.prisma.firsts.findMany({
      where: { babyId },
    });
    return { message: 'all firsts retrieved successfully', firsts };
  }
  async firstById(babyId: string, id: string) {
    const first = await this.prisma.firsts.findFirst({
      where: { babyId, id },
    });
    return { message: 'retrieved first successfully', first };
  }
  async addReminder(addReminderDto: AddReminderDto, id: string) {
    const reminder = await this.prisma.reminders.create({
      data: { ...addReminderDto, babyId: id },
    });
    return { message: 'added reminder successfully', reminder };
  }
  async updateReminder(updateReminderDto: UpdateReminderDto, id: string) {
    const reminder = await this.prisma.reminders.update({
      where: { id },
      data: updateReminderDto,
    });
    return { message: 'reminder updated successfully', reminder };
  }
  async deleteReminder(id: string) {
    await this.prisma.reminders.delete({ where: { id } });
    return { message: 'reminder deleted successfully' };
  }
  async allReminders(babyId: string) {
    const reminders = await this.prisma.reminders.findMany({
      where: { babyId },
    });
    return { message: 'all reminders retrieved successfully', reminders };
  }
  async reminderById(babyId: string, id: string) {
    const reminder = await this.prisma.reminders.findFirst({
      where: { babyId, id },
    });
    return { message: 'retrieved reminder successfully', reminder };
  }
}
