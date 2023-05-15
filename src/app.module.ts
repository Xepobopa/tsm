import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import * as Joi from "joi";
import {UserModule} from "./user/user.module";
import {TokenModule} from "./token/token.module";
import {AuthModule} from "./auth/auth.module";
import {ProjectModule} from "./project/project.module";

@Module({
    imports: [
        UserModule,
        TokenModule,
        AuthModule,
        ProjectModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                SECRET_ACCESS: Joi.string().required(),
                SECRET_REFRESH: Joi.string().required(),
                DB_CONNECTION_STRING: Joi.string().required(),
                PORT: Joi.number().required(),
                NODE_ENV: Joi.string().required().valid("DEVELOPMENT", "PRODUCTION")
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
