import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
      description: "Set password. Minimal length is 6 characters, it must contain at least 1 number, 1 uppercase, 1 lowercase, 1 symbol",
      example: "j4_SK*55dsfvScv",
      title: "Password",
      type: String,
      required: true,
  })
  @IsString()
  @IsStrongPassword({
      minLength: 6,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1
    },
    {
      message: "Password is too simple. Minimal length is 6 characters, it must contain at least 1 number, 1 uppercase, 1 lowercase, 1 symbol"
    }
  )
  password: string;

  @ApiProperty({
      description: "Set email to user. It can be used to delegate task",
      example: "ismartsdn4477@gmail.com",
      title: "Email",
      type: String,
      required: true,
  })
  @IsEmail({}, { message: "Email is wrong" })
  email: string;
}