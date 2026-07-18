import {
    HttpException,
} from '@nestjs/common';

import { ErrorCode } from '../../errors/error-codes';

export abstract class AppException extends HttpException {

    protected constructor(
        statusCode: number,
        code: ErrorCode,
        message: string,
    ) {

        super(
            {
                success: false,

                statusCode,

                code,

                message,
            },
            statusCode,
        );
    }
}