import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
