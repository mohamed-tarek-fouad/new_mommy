import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DeleteAccountDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  reason: string;
}
