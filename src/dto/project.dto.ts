import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ProjectDto {
    @ApiProperty({
        description: "Project id in database. Title must be unique",
        title: "Project Id",
        type: String,
        required: true,
    })
    _id: string

    @ApiProperty({
        description: "Set title to your project.",
        example: "Management system",
        title: "Title",
        type: String,
        required: true,
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: "Set description to your project.",
        example: "Develop management system for business",
        title: "Description",
        type: String,
        required: true,
    })
    @IsString()
    desc: string;
}