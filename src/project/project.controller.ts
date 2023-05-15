import {Body, Controller, Delete, Get, Param, Post, Query, UseGuards} from "@nestjs/common";
import {ProjectService} from "./project.service";
import {UserService} from "../user/user.service";
import {ParseIdPipe} from "../pipe/parse-id.pipe";
import {CreateProjectDto} from "../dto/create-project.dto";
import {TaskQueryDto} from "../dto/task-query.dto";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {CreateTaskDto} from "../dto/create-task.dto";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {TaskDto} from "../dto/task.dto";

@ApiTags('Project / Tasks')
@Controller('project')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
    description: "Your access token is not valid or it expired. " +
        "Maybe you forgot to add 'Bearer' at the start of the access-token string"
})
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly userService: UserService
    ) {
    }


    @Post('createOne')
    @ApiOperation({summary: "Create a new project with tasks"})
    @ApiCreatedResponse({description: "Project / tasks have been created successful", type: CreateProjectDto})
    async createOne(@Body() newProject: CreateProjectDto) {
        // make sure that user with email newProject.tasks[].userTodo exist. If not, Exception will be thrown by findOneByEmail()
        newProject.tasks.map(async (task) => await this.userService.findOneByEmail(task.userTodo));
        return await this.projectService.createOne(newProject);
    }

    @ApiOperation({summary: "Return project with tasks (if they exist) by project Id"})
    @ApiOkResponse({description: "Project / tasks have been found", type: CreateProjectDto})
    @ApiNotFoundResponse({description: "Project with provided Id not exist"})
    @ApiBadRequestResponse({description: "Provided parameter is not MongoId"})
    @Get('getOne/:id')
    async getOne(@Param('id', ParseIdPipe) id: string) {
        return await this.projectService.getOne(id);
    }

    @ApiOperation({summary: "Return tasks of the specific project that filtered by query params"})
    @ApiOkResponse({description: "Tasks have been found", type: [TaskDto]})
    @ApiNotFoundResponse({description: "Tests with provided Id / query params not exist"})
    @ApiBadRequestResponse({description: "Provided parameter is not MongoId"})
    @Get(':projectId/getTasks')
    async getTasksByIdParams(@Param('projectId', ParseIdPipe) id: string, @Query() query: TaskQueryDto) {
        return await this.projectService.getTasksByParams(query, id)
    }

    @ApiOperation({summary: "Return all tasks of all projects by query params (Can be useful when searching tasks only by UserTodo(email))"})
    @ApiOkResponse({description: "Tasks have been found", type: [TaskDto]})
    @ApiNotFoundResponse({description: "Tests with provided Id / query params not exist"})
    @Get('getTasks')
    async getTasksByParams(@Query() query: TaskQueryDto) {
        return await this.projectService.getTasksByParams(query)
    }

    @ApiOperation({summary: "Return deleted project by provided Id. Delete also all tasks that connected with provided Id project"})
    @ApiOkResponse({description: "Project have been deleted"})
    @ApiNotFoundResponse({description: "Tests with provided Id / query params not exist"})
    @ApiBadRequestResponse({description: "Provided parameter is not MongoId"})
    @Delete('deleteOne/:id')
    async deleteOne(@Param('id', ParseIdPipe) id: string) {
        return await this.projectService.deleteOne(id);
    }

    @ApiOperation({summary: "Return added tasks to a specific project. Use it only after /login endpoint to set refreshToken to cookies"})
    @ApiCreatedResponse({description: "Tasks have been added"})
    @ApiNotFoundResponse({description: "Tests with provided Id / query params not exist"})
    @ApiBadRequestResponse({description: "Provided parameter is not MongoId"})
    @ApiBody({type: [CreateTaskDto]})
    @Post(':projectId/addTasks')
    async addTasks(@Body() newTasks: CreateTaskDto[], @Param('projectId', ParseIdPipe) projId: string) {
        await this.projectService.addTasks(projId, newTasks);
    }
}