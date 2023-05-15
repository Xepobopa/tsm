import {IsEnum, IsMongoId, IsOptional, IsString} from "class-validator";
import {TaskStatus} from "../enum/task-status.enum";
import {CreateTaskDto} from "./create-task.dto";
import {ApiProperty} from "@nestjs/swagger";

export class TaskDto extends CreateTaskDto{
    @ApiProperty({
        description: 'Task id in the database.',
        type: String,
        title: "Task Id",
        example: "645fc09b10e26c6b30e27ca1"
    })
    @IsOptional()
    _id: string

    @ApiProperty({
        description: "Set an Id that refers to the project",
        example: "645fc09b10e26c6b30e27c9e",
        title: "Project Id",
        type: String,
        required: false,
    })
    @IsOptional()
    @IsMongoId()
    projectId: string;
}