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
import { calcAge } from '@app/common/functions';
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
    const user = await this.prisma.users.findMany({});
    if (user.length === 0) {
      throw new HttpException('there is no users', HttpStatus.BAD_REQUEST);
    }
    return { ...user, message: 'fetched all users successfully' };
  }

  async userById(req) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        baby: true,
      },
    });
    if (!user) {
      throw new HttpException(
        "this user does'nt exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    delete user.password;
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

    const url = image[0] ? await this.uploadImage(image[0].buffer) : null;
    const user = await this.prisma.baby.create({
      data: {
        ...babyDto,
        image: url,
        usersId: req.user.id,
        weight: babyDto.weight ? parseFloat(babyDto.weight) : null,
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
    const url = images[0] ? await this.uploadImage(images[0].buffer) : null;
    const imageToDelete = await this.prisma.baby.findUnique({ where: { id } });
    const publicId = imageToDelete.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error(error);
      }
    });
    await this.prisma.baby.updateMany({
      where: {
        id,
        usersId: req.user.id,
      },
      data: {
        ...babyDto,
        image: url,
        weight: babyDto.weight ? parseFloat(babyDto.weight) : null,
      },
    });
    return { message: 'updated babies successfully' };
  }
  async babyById(id: string, req) {
    const baby = await this.prisma.baby.findFirst({
      where: {
        id,
        usersId: req.user.id,
      },
    });
    return { message: 'retrieved baby successfully', baby };
  }
  async addMedicalRecord(addMedicalDto: AddMedicalDto, id: string, req) {
    const baby = await this.prisma.baby.findUnique({ where: { id } });
    const age = calcAge(baby.birthDate, addMedicalDto.date);
    const medicalDocument = await this.prisma.medicalHistory.create({
      data: { ...addMedicalDto, babyId: id, age, usersId: req.user.id },
    });
    return { message: 'added medical document successfully', medicalDocument };
  }
  async updateMedicalRecord(
    updateMedicalDto: UpdateMedicalDto,
    id: string,
    req,
  ) {
    const baby = await this.prisma.medicalHistory.findFirst({
      where: { id, usersId: req.user.id },
      include: { Baby: true },
    });
    const age = updateMedicalDto.date
      ? calcAge(baby.Baby.birthDate, updateMedicalDto.date)
      : baby.date;
    await this.prisma.medicalHistory.updateMany({
      where: { id, usersId: req.user.id },
      data: { ...updateMedicalDto, age },
    });
    const document = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
    return { message: 'updated medical document successfully', document };
  }
  async deleteMedicalRecord(id: string, req) {
    await this.prisma.medicalHistory.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'medical record deleted successfully' };
  }
  async allRecords(babyId: string, req) {
    const medicalHistory = await this.prisma.medicalHistory.findMany({
      where: { babyId, usersId: req.user.id },
    });
    return { message: 'all medical history', medicalHistory };
  }
  async medicalRecordById(id: string, req) {
    const medicalDocument = await this.prisma.medicalHistory.findFirst({
      where: { id, usersId: req.user.id },
    });
    return { message: 'all medical history', medicalDocument };
  }
  async addMedicalDocument(images, id: string, req) {
    if (!images[0])
      throw new HttpException(
        'you must upload image first',
        HttpStatus.BAD_REQUEST,
      );
    const url = await this.uploadImage(images[0].buffer);
    const document = await this.prisma.medicalDocuments.create({
      data: {
        document: url,
        babyId: id,
        usersId: req.user.id,
      },
    });
    return { message: 'added new document successfully', document };
  }
  async updateMedicalDocument(images, id: string, req) {
    const imageToDelete = await this.prisma.medicalDocuments.findFirst({
      where: { id, usersId: req.user.id },
    });
    const url = images[0] ? await this.uploadImage(images[0].buffer) : null;
    const publicId = imageToDelete.document.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error(error);
      }
    });
    await this.prisma.medicalDocuments.updateMany({
      where: {
        id,
        usersId: req.user.id,
      },
      data: {
        document: url,
      },
    });
    return { message: 'updated document successfully', document: url };
  }
  async deleteDocument(id: string, req) {
    const imageToDelete = await this.prisma.medicalDocuments.findFirst({
      where: { id, usersId: req.user.id },
    });
    const publicId = imageToDelete.document.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error(error);
      }
    });
    await this.prisma.medicalDocuments.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'Deleted Document Successfully' };
  }
  async allDocuments(id: string, req) {
    const allDocuments = await this.prisma.medicalDocuments.findMany({
      where: { usersId: req.user.id, babyId: id },
    });
    return { message: 'Retrieved All Documents Successfully', allDocuments };
  }
  async documentById(id: string, req) {
    const documnet = await this.prisma.medicalDocuments.findFirst({
      where: { id, usersId: req.user.id },
    });
    return { message: 'Retrieved Document successfully', documnet };
  }
  async addActivity(addActivityDto: AddActivityDto, id: string, req) {
    const activity = await this.prisma.activities.create({
      data: { ...addActivityDto, babyId: id, usersId: req.user.id },
    });
    return { message: 'added new activity successfully', activity };
  }
  async updateActivity(updateActivityDto: UpdateActivityDto, id: string, req) {
    await this.prisma.activities.updateMany({
      where: { id, usersId: req.user.id },
      data: updateActivityDto,
    });
    const activity = await this.prisma.activities.findUnique({ where: { id } });
    return { message: 'updated Activity sucessfully', activity };
  }
  async deleteActivity(id: string, req) {
    await this.prisma.activities.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'deleted Activity' };
  }
  async allActivities(babyId: string, req) {
    const activities = await this.prisma.activities.findMany({
      where: { babyId, usersId: req.user.id },
    });
    return { message: 'all activities retrieved successfully', activities };
  }
  async activityById(babyId: string, id: string, req) {
    const activity = await this.prisma.activities.findFirst({
      where: { babyId, id, usersId: req.user.id },
    });
    return { message: 'retrieved activity successfully', activity };
  }
  async addMeal(addFeedingDto: AddFeedingDto, id: string, req) {
    const meal = await this.prisma.feeding.create({
      data: { ...addFeedingDto, babyId: id, usersId: req.user.id },
    });
    return { message: 'added meal successfully', meal };
  }
  async updateMeal(updateMealDto: UpdateFeedingDto, id: string, req) {
    await this.prisma.feeding.updateMany({
      where: { id, usersId: req.user.id },
      data: updateMealDto,
    });
    const meal = await this.prisma.feeding.findMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'meal updated successfully', meal };
  }
  async deleteMeal(id: string, req) {
    await this.prisma.feeding.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'meal deleted successfully' };
  }
  async allMeals(babyId: string, req) {
    const meals = await this.prisma.feeding.findMany({
      where: { babyId, usersId: req.user.id },
    });
    return { message: 'all meals retrieved successfully', meals };
  }
  async mealById(babyId: string, id: string, req) {
    const meal = await this.prisma.feeding.findFirst({
      where: { babyId, id, usersId: req.user.id },
    });
    return { message: 'retrieved meal successfully', meal };
  }
  async addGrowth(addGrowthDto: AddGrowthDto, id: string, req) {
    const baby = await this.prisma.baby.findUnique({ where: { id } });
    const age = calcAge(baby.birthDate, addGrowthDto.date);
    const growthMilestone = await this.prisma.growth.create({
      data: {
        ...addGrowthDto,
        babyId: id,
        height: parseFloat(addGrowthDto.height),
        weight: parseFloat(addGrowthDto.weight),
        age,
        usersId: req.user.id,
      },
    });

    return { message: 'added growth milestone successfully', growthMilestone };
  }
  async updateGrowth(updateGrowthDto: updateGrowthDto, id: string, req) {
    const growth = await this.prisma.growth.findFirst({
      where: { id, usersId: req.user.id },
      include: { Baby: true },
    });
    const age = updateGrowthDto.date
      ? calcAge(growth.Baby.birthDate, updateGrowthDto.date)
      : growth.date;
    await this.prisma.growth.updateMany({
      where: { id, usersId: req.user.id },
      data: {
        ...updateGrowthDto,
        height: updateGrowthDto.height
          ? parseFloat(updateGrowthDto.height)
          : null,
        weight: updateGrowthDto.weight
          ? parseFloat(updateGrowthDto.weight)
          : null,
        age,
      },
    });
    const growthMilestone = await this.prisma.growth.findFirst({
      where: { id, usersId: req.user.id },
    });
    return {
      message: 'growth milestone updated successfully',
      growthMilestone,
    };
  }
  async deleteGrowth(id: string, req) {
    await this.prisma.growth.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'growth milestone deleted successfully' };
  }
  async allGrowth(babyId: string, req) {
    const growthMilestones = await this.prisma.growth.findMany({
      where: { babyId, usersId: req.user.id },
    });
    return {
      message: 'all growth milestones retrieved successfully',
      growthMilestones,
    };
  }
  async growthById(babyId: string, id: string, req) {
    const growthMilestone = await this.prisma.growth.findFirst({
      where: { babyId, id, usersId: req.user.id },
    });
    return {
      message: 'retrieved growth milestone successfully',
      growthMilestone,
    };
  }
  async addFirst(addFirstDto: AddFirstDto, id: string, req) {
    const first = await this.prisma.firsts.create({
      data: { ...addFirstDto, babyId: id, usersId: req.user.id },
    });
    return { message: 'added first successfully', first };
  }
  async updateFirst(updateFirstDto: UpdateFirstDto, id: string, req) {
    await this.prisma.firsts.updateMany({
      where: { id, usersId: req.user.id },
      data: updateFirstDto,
    });
    const first = await this.prisma.firsts.findFirst({
      where: { id, usersId: req.user.id },
    });
    return { message: 'first updated successfully', first };
  }
  async deleteFirst(id: string, req) {
    await this.prisma.firsts.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'first deleted successfully' };
  }
  async allFirsts(babyId: string, req) {
    const firsts = await this.prisma.firsts.findMany({
      where: { babyId, usersId: req.user.id },
    });
    return { message: 'all firsts retrieved successfully', firsts };
  }
  async firstById(babyId: string, id: string, req) {
    const first = await this.prisma.firsts.findFirst({
      where: { babyId, id, usersId: req.user.id },
    });
    return { message: 'retrieved first successfully', first };
  }
  async addReminder(addReminderDto: AddReminderDto, id: string, req) {
    const reminder = await this.prisma.reminders.create({
      data: { ...addReminderDto, babyId: id, usersId: req.user.id },
    });
    return { message: 'added reminder successfully', reminder };
  }
  async updateReminder(updateReminderDto: UpdateReminderDto, id: string, req) {
    await this.prisma.reminders.updateMany({
      where: { id, usersId: req.user.id },
      data: updateReminderDto,
    });
    const reminder = await this.prisma.reminders.findFirst({
      where: { id, usersId: req.user.id },
    });
    return { message: 'reminder updated successfully', reminder };
  }
  async deleteReminder(id: string, req) {
    await this.prisma.reminders.deleteMany({
      where: { id, usersId: req.user.id },
    });
    return { message: 'reminder deleted successfully' };
  }
  async allReminders(babyId: string, req) {
    const reminders = await this.prisma.reminders.findMany({
      where: { babyId, usersId: req.user.id },
    });
    return { message: 'all reminders retrieved successfully', reminders };
  }
  async reminderById(babyId: string, id: string, req) {
    const reminder = await this.prisma.reminders.findFirst({
      where: { babyId, id, usersId: req.user.id },
    });
    return { message: 'retrieved reminder successfully', reminder };
  }
}
