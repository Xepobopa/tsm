import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {Request, Response} from "express";
import {CreateUserDto} from "../dto/create-user.dto";
import {
    ApiBadRequestResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {UserDto} from "../dto/user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: "Return user, access and refresh tokens"})
    @ApiOkResponse({description: "User has been authorized"})
    @ApiUnauthorizedResponse({description: "Email or password is wrong"})
    @Post('login')
    async login(@Body() body: CreateUserDto, @Res() res: Response) {
        const user = await this.authService.login(body);
        res.cookie('refreshToken', user.refreshToken, {
            maxAge: 20 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        console.log(user.accessToken);
        res.json(user);
    }

    @ApiOperation({summary: "Return created user by provided data"})
    @ApiCreatedResponse({description: "User has been created", type: UserDto})
    @ApiBadRequestResponse({description: "Email field is not email or password is too easy"})
    @Post('reg')
    @HttpCode(HttpStatus.CREATED)
    async writeUser(@Body() body: CreateUserDto, @Res() res: Response) {
        const user = await this.authService.registration(body);

        return res.json({...user});
    }

    @ApiOperation({summary: "Return new accessToken by refreshToken in cookie"})
    @ApiUnauthorizedResponse({
        description: "Your access token is not valid or it expired. " +
            "Maybe you forgot to add 'Bearer' at the start of the access-token string"
    })
    @ApiCookieAuth()
    @ApiCreatedResponse({description: "New access token has been created", type: String})
    @Get('refresh')
    @HttpCode(HttpStatus.CREATED)
    async refresh(@Req() req: Request) {
        return await this.authService.refresh(this.authService.getRefreshToken(req));
    }
}