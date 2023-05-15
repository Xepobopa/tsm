import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import * as mongoose from "mongoose";

@Injectable()
export class ParseIdPipe implements PipeTransform {
    constructor() {}

    transform(value: any, metadata: ArgumentMetadata): any {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new BadRequestException(`Validation Error (MongoId expected, but got '${value}')`);
        }
        return value;
    }
}