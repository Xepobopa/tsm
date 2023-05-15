import {HttpStatus, INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from "../src/auth/auth.module";
import {MongooseModule} from "@nestjs/mongoose";
import * as request from 'supertest';
import {ProjectStub} from "./stub/project.stub";
import {ProjectModule} from "../src/project/project.module";

describe('Auth', () => {
    let app: INestApplication;
    let projId: string = "64621f5c7768c8f6e9a2cd26";
    let accessToken: string;
    let refreshToken: string;
    let stub: ProjectStub;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env'
                }),
                AuthModule,
                ProjectModule,
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
        stub = new ProjectStub();
        await app.init();
    });

    it("/POST \t /project/createOne", async () => {
        await request(app.getHttpServer())
            .post('/auth/reg')
            .send(stub.createUser())
            .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
            .post('/auth/login')
            .send(stub.createUser())
            .expect(HttpStatus.CREATED)
            .then(({body}) => accessToken = body.accessToken);

        return request(app.getHttpServer())
            .post('/project/createOne')
            .auth(accessToken, {type: 'bearer'})
            .send({...stub.createProject(), tasks: [stub.createTask()]})
            .expect(HttpStatus.CREATED)
            .then(({body}) => {
                projId = body._id;
                expect(body).toEqual({
                    ...stub.createProject(),
                    _id: projId
                })
            });
    });

    it("/GET \t /project/getOne/:id", async () => {
        await request(app.getHttpServer())
            .get(`/project/getOne/${projId}`)
            .auth(accessToken, {type: 'bearer'})
            .expect(HttpStatus.OK)
            .then(({body}) => {
                expect(body).toEqual({
                    ...stub.createProject(),
                    _id: projId,
                    tasks: [
                        {
                            ...stub.createTask(),
                            _id: expect.any(String),
                            projectId: projId
                        }
                    ]
                })
            })
    })

    it("/GET \t /project/:id/getTasks", async () => {
        await request(app.getHttpServer())
            .get(`/project/${projId}/getTasks?status=New`)
            .auth(accessToken, {type: 'bearer'})
            .expect(HttpStatus.OK)
            .then(({body}) => {
                expect(body).toEqual([{
                    ...stub.createTask(),
                    _id: expect.any(String),
                    projectId: projId
                }])
            })
    })

    it("/GET \t /project/:id/addTasks", async () => {
        await request(app.getHttpServer())
            .post(`/project/${projId}/addTasks`)
            .auth(accessToken, {type: 'bearer'})
            .send([stub.addTask()])
            .expect(HttpStatus.CREATED)
    })

    it("/GET \t /project/getTasks", async () => {
        await request(app.getHttpServer())
            .get(`/project/getTasks?status=New`)
            .auth(accessToken, {type: 'bearer'})
            .expect(HttpStatus.OK)
            .then(({body}) => {
                console.log(body);
                expect(body).toEqual([
                    {
                        ...stub.createTask(),
                        _id: expect.any(String),
                        projectId: projId
                    }
                ])
            })
    })

    afterAll(async () => {
        await request(app.getHttpServer()).delete(`/project/deleteOne/${projId}`).auth(accessToken, {type: 'bearer'});
        await app.close();
    });
});