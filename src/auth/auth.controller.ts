import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {Request, Response} from "express";
import {CreateUserDto} from "../dto/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    //@UseGuards(LocalAuthGuard)
    async login(@Body() body: CreateUserDto, @Res() res: Response) {
        const user = await this.authService.login(body);
        res.cookie('refreshToken', user.refreshToken, {
            maxAge: 20 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        console.log(user.accessToken);
        res.json(user);
    }

    @Post('reg')
    @HttpCode(HttpStatus.CREATED)
    async writeUser(@Body() body: CreateUserDto, @Res() res: Response) {
        const user = await this.authService.registration(body);

        return res.json({...user});
    }

    @Get('refresh')
    @HttpCode(HttpStatus.CREATED)
    async refresh(@Req() req: Request) {
        return await this.authService.refresh(this.authService.getRefreshToken(req));
    }
}