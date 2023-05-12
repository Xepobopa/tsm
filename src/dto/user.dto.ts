import { CreateUserDto } from "./create-user.dto";
import {IsMongoId} from "class-validator";

export class UserDto extends CreateUserDto {
  @IsMongoId({ message: 'Is not a mongoId' })
  _id: string;
}