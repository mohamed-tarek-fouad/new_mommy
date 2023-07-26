import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateActivityDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/, {
    message: 'date must follow yyyy-mm-dd',
  })
  @IsNotEmpty()
  @IsOptional()
  date: string;
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @IsNotEmpty()
  activity: string;
  @IsString()
  @IsOptional()
  @Matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(?:am|pm)$/i, {
    message: 'Time must be in the format of "hh:mm pm/am"',
  })
  @IsNotEmpty()
  time: string;
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsNotEmpty()
  note: string;
}
