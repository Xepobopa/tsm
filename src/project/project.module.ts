import {Module} from '@nestjs/common';
import {ProjectService} from './project.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ProjectController} from "./project.controller";
import {UserModule} from "../user/user.module";
import {Project, ProjectSchema} from "../schema/project.schema";
import {Task, TaskSchema} from "../schema/task.schema";

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}, {name: Task.name, schema: TaskSchema}]),
    ],
    providers: [
        ProjectService,
    ],
    controllers: [ProjectController],
    exports: [ProjectService]
})
export class ProjectModule {
}
