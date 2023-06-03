import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class RegiserUserDto {
  firstName: string;
  lastName: string;
  @IsNumberString()
  phoneNumber: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  hash: string;
  address: string;
  isBlocked: boolean;
}
