import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import * as Joi from "joi";
import {UsersModule} from "./user/users.module";
import {TokenModule} from "./token/token.module";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        UsersModule,
        TokenModule,
        AuthModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                SECRET_ACCESS: Joi.string().required(),
                SECRET_REFRESH: Joi.string().required(),
                DB_CONNECTION_STRING: Joi.string().required(),
                PORT: Joi.number().required()
            })
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>("DB_CONNECTION_STRING")
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
