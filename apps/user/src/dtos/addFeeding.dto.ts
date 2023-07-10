import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class AddFeedingDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsNotEmpty()
  date: string;
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  food: string;
  @IsString()
  @Matches(/^1[012]:[0-5][0-9]\s(?:am|pm)$/i, {
    message: 'Time must be in the format of "12:34 pm"',
  })
  @IsNotEmpty()
  time: string;
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  note: string;
}
