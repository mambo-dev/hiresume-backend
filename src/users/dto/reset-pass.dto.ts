import { IsNotEmpty, IsEmail } from "class-validator";
import { Match } from "./password.validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail({ message: "must be a valid email" })
  email: string;
  @IsNotEmpty()
  passwordResetCode: string;
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  @Match("newPassword")
  confirmNewPassword: string;
}
