import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../user/users.service";
import { TokenDocument } from "../schema/token.schema";
import { UserDocument } from "../schema/user.schema";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService,
    ) {
    }

    async refresh(token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        const decoded = await this.tokenService.verifyRefreshToken(token);
        const tokenFromDb: TokenDocument = await this.tokenService.findToken(token);
        if (!decoded || !tokenFromDb) {
            throw new UnauthorizedException();
        }

        const payload = await this.userService.findOneById(tokenFromDb.userId);
        return this.tokenService.generateToken(payload.toObject()).accessToken;
    }

    async login(userData: CreateUserDto) {
        const user: UserDocument = await this.userService.login(userData);
        const tokens = this.tokenService.generateToken(user.toObject());
        await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);

        return {...tokens, user};
    }

    async registration(userData: CreateUserDto) {
        const user: UserDocument = await this.userService.writeUser(userData);

        return {user};
    }

    getRefreshToken(req: Request) {
        let refreshToken;
        if (req && req.cookies) {
            refreshToken = req.cookies['refreshToken'];
        }
        return refreshToken;
    }
}
