import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateBabyDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsNotEmpty()
  @IsOptional()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @IsOptional()
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
  babyName: string;

  @IsNotEmpty()
  @IsOptional()
  @MaxLength(2)
  weight: number;
}
export class UpdateBabyListDto {
  @IsNotEmpty()
  baby: UpdateBabyDto[];
}
