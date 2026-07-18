import {
    HttpStatus,
} from '@nestjs/common';

import { ErrorCode } from '../../errors/error-codes';

import { AppException } from './app.exception';

export abstract class AppNotFoundException
    extends AppException {

    protected constructor(
        code: ErrorCode,
        message: string,
    ) {

        super(
            HttpStatus.NOT_FOUND,
            code,
            message,
        );
    }
}