import {HttpException, HttpStatus} from '@nestjs/common';

export class UserException extends HttpException {
    constructor(dataNotFound?: Object) {
        super(`[Database Error] Can't find user in db. Provided data: ${JSON.stringify(dataNotFound)}`, HttpStatus.NOT_FOUND);
    }
}