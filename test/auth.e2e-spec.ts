import {HttpStatus, INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from "../src/auth/auth.module";
import {MongooseModule} from "@nestjs/mongoose";
import * as request from 'supertest';
import {authStub} from "./stub/auth.stub";

describe('Auth', () => {
    let app: INestApplication;
    let userId: string;
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env'
                }),
                AuthModule,
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async (config: ConfigService) => ({
                        uri: config.get<string>("DB_TEST_CONNECTION_STRING")
                    }),
                    inject: [ConfigService]
                })
            ]
        }).compile()

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it("/POST \t /auth/reg", () => {
        return request(app.getHttpServer())
            .post('/auth/reg')
            .send(authStub())
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                userId = body.user._id;
                expect(body).toEqual({
                    user: {
                        ...authStub(),
                        _id: userId,
                        password: expect.any(String)
                    }
                })
            })
    })

    it("/POST \t /auth/login", () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(authStub())
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                accessToken = body.accessToken;
                refreshToken = body.refreshToken;
                expect(body).toEqual({
                    accessToken,
                    refreshToken,
                    user: {
                        ...authStub(),
                        _id: userId,
                        password: expect.any(String)
                    }
                })
            })
    })

    afterAll(async () => {
        await app.close();
    });
});