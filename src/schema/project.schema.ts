import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, SchemaTypes} from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({versionKey: false})
export class Project {
    @Prop({ type: String, unique: true, required: true })
    title: string;

    @Prop({ type: String, required: true })
    desc: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);