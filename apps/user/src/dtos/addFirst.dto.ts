import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class AddFirstDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/, {
    message: 'date must follow yyyy-mm-dd',
  })
  @IsNotEmpty()
  date: string;
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  babyFirst: string;
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  note: string;
}
