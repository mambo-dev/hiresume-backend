import { Match } from "./password.validator";
import {
  IsEmail,
  IsNotEmpty,
} from "class-validator/types/decorator/decorators";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match("password")
  confirmPassword: string;

  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  role: string;
}
