import {Controller, Get, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {UserDto} from "../dto/user.dto";

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
    constructor(private userService: UserService) {
    }

    @ApiUnauthorizedResponse({
        description: "Your access token is not valid or it expired. " +
            "Maybe you forgot to add 'Bearer' at the start of the access-token string"
    })
    @ApiOperation({summary: "Return all users"})
    @ApiOkResponse({description: "Tasks have been found", type: [UserDto]})
    @Get('profiles')
    @UseGuards(JwtAuthGuard)
    async getProfiles() {
        return await this.userService.getAll();
    }

}
