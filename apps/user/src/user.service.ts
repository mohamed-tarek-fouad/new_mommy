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
import { UpdateBabyListDto } from './dtos/deleteUpdateBaby.dto';
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
  async addBaby(baby: BabyDto, req, image) {
    const today = new Date();

    // Parse the birth date string and create a Date object
    const birthdate = new Date(baby.birthDate);

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
    const babies = await this.prisma.users.findUnique({
      where: {
        id: req.user.id,
      },
      select: { baby: true },
    });
    let babyNameExist = '';
    babies.baby.forEach((b) => {
      if (b.babyName === baby.babyName) babyNameExist = b.babyName;
    });
    if (babyNameExist)
      throw new HttpException(
        'this baby Name does exist',
        HttpStatus.BAD_REQUEST,
      );
    const babywithImage = {
      ...baby,
      image: url,
      weight: Number(baby.weight),
    };
    const user = await this.prisma.users.update({
      where: { id: req.user.id },
      data: {
        baby: {
          push: babywithImage,
        },
      },
    });
    return { user, message: 'updated babies successfully' };
  }
  async deleteBaby(baby: BabyDto, req) {
    const userById = await this.prisma.users.findUnique({
      where: { id: req.user.id },
      select: { baby: true },
    });
    const newArray = userById.baby.filter((b) => {
      if (b.babyName !== baby.babyName) {
        return b;
      }
    });
    const user = await this.prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        baby: newArray,
      },
    });
    return { user, message: 'deleted baby successfully' };
  }
  async updateBaby(baby: UpdateBabyListDto, req) {
    const user = await this.prisma.users.update({
      where: {
        id: req.user.id,
      },
      data: {
        baby: baby.baby,
      },
    });
    return { user, message: 'updated babies successfully' };
  }
}
