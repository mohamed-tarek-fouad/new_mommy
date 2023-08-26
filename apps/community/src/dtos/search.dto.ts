import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  searchText: string;
}
