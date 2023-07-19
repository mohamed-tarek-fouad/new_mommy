import { IsString, MaxLength } from 'class-validator';

export class DeleteAccountDto {
  @MaxLength(100)
  @IsString()
  reason: string;
}
