import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
enum Gender {
  boy = 'boy',
  girl = 'girl',
}

export class BabyDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/, {
    message: 'date must follow yyyy-mm-dd',
  })
  @IsNotEmpty()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[\s]*[a-zA-Z][a-zA-Z0-9]*[\s]*$/, {
    message: 'name cannot start with number',
  })
  babyName: string;

  @IsNotEmpty()
  @IsOptional()
  @MaxLength(2)
  @IsNumberString()
  weight: string;
}
