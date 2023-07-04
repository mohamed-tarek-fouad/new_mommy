import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';
import { Address } from '../types';
const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};

export class UpdateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  @IsOptional()
  firstname: string;

  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  lastname: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;

  @IsOptional()
  address: Address;
  @Matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
  @IsOptional()
  @IsNotEmpty()
  birthDate: string;

  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
