import {IsEnum, IsMongoId, IsOptional, IsString} from "class-validator";
import {TaskStatus} from "../enum/task-status.enum";
import {ApiProperty} from "@nestjs/swagger";

export class TaskQueryDto {
    @ApiProperty({title: "Title", description: "Title of a task (filtering requires an exact match)", type: String, required: false,})
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({title: "Title", description: "Description of a task (filtering requires an exact match)", type: String, required: false,})
    @IsOptional()
    @IsString()
    desc: string;

    @ApiProperty({
        description: "Search tasks by status.",
        title: "Task status.",
        type: String,
        enum: TaskStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @ApiProperty({
        description: "Search tasks by user's email.",
        title: "User email.",
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString()
    userTodo: string;
}