import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskException extends HttpException {
    constructor(dataNotFound?: Object) {
        super(`[Database Error] Can't find any tasks in db. Provided data: ${JSON.stringify(dataNotFound)}`, HttpStatus.NOT_FOUND);
    }
}