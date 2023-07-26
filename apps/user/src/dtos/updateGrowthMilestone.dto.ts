import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class updateGrowthDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/, {
    message: 'date must follow yyyy-mm-dd',
  })
  @IsNotEmpty()
  @IsOptional()
  date: string;
  @IsString()
  @MaxLength(3)
  @IsNotEmpty()
  @IsOptional()
  weight: string;
  @IsString()
  @MaxLength(4)
  @IsNotEmpty()
  @IsOptional()
  height: string;
}
