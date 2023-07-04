/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  // Validate,
  // maxLength,
} from 'class-validator';
// import {
//   //PasswordValidation,
//   PasswordValidationRequirement,
// } from 'class-validator-password-check';
// const passwordRequirement: PasswordValidationRequirement = {
//   mustContainLowerLetter: true,
//   mustContainNumber: true,
//   mustContainSpecialCharacter: true,
//   mustContainUpperLetter: true,
// };
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  //@Validate(PasswordValidation, [passwordRequirement])
  password: string;
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
  firstname: string;
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
  lastname: string;
}
