import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
enum Gender {
  boy = 'boy',
  girl = 'girl',
}

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
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
  @IsOptional()
  babyName: string;

  @IsNotEmpty()
  @IsOptional()
  @IsPositive()
  @Max(99)
  weight: number;
}
