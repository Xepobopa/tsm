import { CreateUserDto } from "./create-user.dto";
import {IsMongoId} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto extends CreateUserDto {
  @IsMongoId({ message: 'Is not a mongoId' })
  @ApiProperty({title: "Id of the User ", type: String})
  _id: string;
}