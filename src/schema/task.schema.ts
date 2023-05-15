import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, SchemaTypes} from 'mongoose';
import {TaskStatus} from "../enum/task-status.enum";

export type TaskDocument = HydratedDocument<Task>;

@Schema({versionKey: false})
export class Task {
    @Prop({ type: String, require: true, unique: false })
    title: string;

    @Prop({ type: String, require: true })
    desc: string;

    @Prop({ type: String, enum: TaskStatus, require: true })
    status: string;

    @Prop({ type: String, require: true })
    userTodo: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Project', required: true })
    projectId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);