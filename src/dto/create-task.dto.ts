import {IsEnum, IsString} from "class-validator";
import {TaskStatus} from "../enum/task-status.enum";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty({
        description: "Set title to your task. Title must be unique",
        example: "Validation",
        title: "Title",
        type: String,
        required: true,
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: "Set description to your task.",
        example: "Add a validation to the auth",
        title: "Description",
        type: String,
        required: true,
    })
    @IsString()
    desc: string;

    @ApiProperty({
        description: "Set task status.",
        example: "New - new Task.\n" +
            "In progress - Task that is working on.\n" +
            "Done - The Task is completed.\n",
        enum: TaskStatus,
        title: "Task status",
        type: String,
        required: true,
    })
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @ApiProperty({
        description: "Set user's email to make him do this task. User mast be registered",
        example: "ismartsdn4477@gmail.com",
        title: "User email",
        type: String,
        required: true,
    })
    @IsString()
    userTodo: string;
}