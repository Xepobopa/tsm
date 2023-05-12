import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as mongoose from "mongoose";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigService>(ConfigService);

    mongoose.pluralize(null);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    const server = await app.listen(config.get<number>('PORT'), () => console.log('Host on http://localhost:5000'));

    const router = server._events.request._router;
    const availableRoutes: [] = router.stack
        .map(layer => {
            if (layer.route) {
                return {
                    route: {
                        path: layer.route?.path,
                        method: layer.route?.stack[0].method,
                    },
                };
            }
        })
        .filter(item => item !== undefined);
    console.log(availableRoutes);
}

bootstrap();
