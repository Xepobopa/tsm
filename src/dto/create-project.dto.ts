import {IsArray, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {TaskDto} from "./task.dto";
import {ProjectDto} from "./project.dto";
import {ApiProperty} from "@nestjs/swagger";
import {CreateTaskDto} from "./create-task.dto";

export class CreateProjectDto extends ProjectDto {
    @ApiProperty({
        description: "Tasks of the certain project",
        title: "Tasks",
        type: [CreateTaskDto],
        required: true,
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TaskDto)
    tasks: TaskDto[];
}