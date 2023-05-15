import {BadRequestException, Injectable, UnauthorizedException,} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {InjectModel} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from "../schema/user.schema";
import {CreateUserDto} from "../dto/create-user.dto";
import {UserException} from "../exception/user.exception";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
    }

    async findOneByEmail(email: string) {
        return this.userModel.findOne({email})
            .orFail(new BadRequestException(`Can't find user with email: ${email}`));
    }

    async getAll() {
        return this.userModel.find();
    }


    async findOneById(id: string) {
        return this.userModel.findOne({_id: new mongoose.Types.ObjectId(id)})
            .orFail(new UserException(id));
    }

    async login(userData: CreateUserDto) {
        const user = await this.userModel.findOne({email: userData.email})
            .orFail(new UnauthorizedException());
        if (!bcrypt.compareSync(userData.password, user.password)) {
            throw new UnauthorizedException();
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
