import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateMedicalDto {
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsNotEmpty()
  date: string;
  @IsString()
  @MaxLength(30)
  doctorName: string;
  @IsString()
  @MaxLength(30)
  diagnosis: string;
}
