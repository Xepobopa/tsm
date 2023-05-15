import {BadRequestException, Injectable,} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Model} from 'mongoose';
import {Project, ProjectDocument} from "../schema/project.schema";
import {CreateProjectDto} from "../dto/create-project.dto";
import {Task, TaskDocument} from "../schema/task.schema";
import {CreateTaskDto} from "../dto/create-task.dto";
import {TaskQueryDto} from "../dto/task-query.dto";
import {ProjectException} from "../exception/project.exception";
import {TaskException} from "../exception/task.exception";
import {TaskDto} from "../dto/task.dto";

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) {
    }

    async createOne(newProject: CreateProjectDto) {
        const project = await this.projectModel.create({title: newProject.title, desc: newProject.desc})
        newProject.tasks.map(task => {
            this.taskModel.create({...task, projectId: project.id});
        })
        return project;
    }

    async getOne(id: string) {
        const project = await this.projectModel.findById(new mongoose.Types.ObjectId(id))
            .orFail(new ProjectException(id))
        const tasks = await this.taskModel.find({projectId: new mongoose.Types.ObjectId(id)});
        return {...project.toObject(), tasks}
    }

    async getTasksByParams(query: TaskQueryDto, id?: string) {
        const tasks = this.taskModel.find(id ? {projectId: new mongoose.Types.ObjectId(id)} : {})
            .orFail(new TaskException({id, query}))
        for (const param in query)
            tasks.where(param.toString(), query[param]);
        return tasks;
    }

    async deleteOne(id: string) {
        const project = await this.projectModel.deleteOne({_id: new mongoose.Types.ObjectId(id)})
            .orFail(new ProjectException(id));
        await this.taskModel.deleteMany({ projectId: new mongoose.Types.ObjectId(id) })
            .orFail(new TaskException(id));
        return project;
    }

    async addTasks(projectId: string, newTasks: CreateTaskDto[]) {
        return newTasks.map(async (task) => await this.taskModel.create({...task, projectId}))
    }
}