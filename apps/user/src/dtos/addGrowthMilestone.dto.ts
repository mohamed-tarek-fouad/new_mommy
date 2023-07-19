import {
  IsNotEmpty,
  IsNumberString,
  Matches,
  MaxLength,
} from 'class-validator';

export class AddGrowthDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsNotEmpty()
  date: string;
  @IsNotEmpty()
  @MaxLength(3)
  @IsNumberString()
  weight: string;
  @IsNotEmpty()
  @MaxLength(4)
  @IsNumberString()
  height: string;
}
