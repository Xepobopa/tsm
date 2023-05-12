import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as uuid from 'uuid';
import { User, UserDocument } from "../schema/user.schema";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserNotExistException } from "../exception/user.exception";
import * as mongoose from "mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
    }

    async findOne(username: string) {
        return this.userModel.findOne({username}).orFail(new UserNotExistException(`Can't find user with name: ${username}`));
    }

    async getAll() {
        return this.userModel.find();
    }


    async findOneById(id: string) {
        return this.userModel.findOne({ _id: new mongoose.Types.ObjectId(id) })
            .orFail(new UserNotExistException(`Can't find user by id: ${id}`));
    }

    async login(userData: CreateUserDto) {
        const user = await this.userModel.findOne({ email: userData.email })
          .orFail(new UserNotExistException(`Can't find user by userData: '${userData.email}'`));
        if (!bcrypt.compareSync(userData.password, user.password)) {
            throw new BadRequestException('Password is wrong')
        }
        return user;
    }

    async writeUser(user: CreateUserDto): Promise<UserDocument> {
        return await this.userModel.create({
            email: user.email,
            password: await bcrypt.hash(user.password, 5),
        } as User);
    }
}
