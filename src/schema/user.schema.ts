import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({versionKey: false})
export class User {
    @Prop({type: String, unique: true, required: true})
    email: string;

    @Prop({required: true, type: String})
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
