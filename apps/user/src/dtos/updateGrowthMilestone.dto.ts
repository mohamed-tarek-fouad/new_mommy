import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class updateGrowthDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsNotEmpty()
  @IsOptional()
  date: string;
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @IsOptional()
  weight: string;
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @IsOptional()
  height: string;
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @IsOptional()
  age: string;
}
