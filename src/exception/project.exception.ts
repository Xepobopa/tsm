import { HttpException, HttpStatus } from '@nestjs/common';

export class ProjectException extends HttpException {
    constructor(dataNotFound?: Object) {
        super(`[Database Error] Can't find any projects in db. Provided data: ${JSON.stringify(dataNotFound)}`, HttpStatus.NOT_FOUND);
    }
}