import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';
const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Validate(PasswordValidation, [passwordRequirement])
  password: string;
  @IsEmail()
  email: string;
}
