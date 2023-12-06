import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";

//create user validation

export class CreateUserValidation {
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

//login validation
export class LoginValidation {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

//verify OTP
export class VerifyUser {
  @IsNotEmpty()
  userId!: string | Object;

  @IsNotEmpty()
  otp!: string;

  @IsNotEmpty()
  token!: string;
}

//resend otp
export class SendOTPToEmail {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

//reset password
export class ResetPassword {
  @IsNotEmpty()
  userId!: string | Object;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
