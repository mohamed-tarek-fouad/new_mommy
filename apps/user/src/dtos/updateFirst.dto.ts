import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateFirstDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsNotEmpty()
  @IsOptional()
  date: string;
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @IsOptional()
  babyFirst: string;
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsOptional()
  note: string;
}
