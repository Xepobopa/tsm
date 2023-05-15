import { Module } from '@nestjs/common';
import {UserService} from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {UserController} from "./user.controller";
import { User, UserSchema } from "../schema/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
