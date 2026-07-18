import {
    HttpStatus,
} from '@nestjs/common';

import {
    Prisma,
} from '@prisma/client';
import { ErrorCode } from '../errors/error-codes';

export class PrismaErrorMapper {

    static map(
        error: Prisma.PrismaClientKnownRequestError,
    ) {

        switch (error.code) {

            case 'P2002':

                return {
                    statusCode:
                        HttpStatus.CONFLICT,

                    code: ErrorCode.DATABASE_ERROR,

                    message:
                        'Une ressource avec cette valeur existe déjà.',
                };

            case 'P2003':

                return {
                    statusCode:
                        HttpStatus.BAD_REQUEST,

                    code: ErrorCode.DATABASE_ERROR,

                    message:
                        'Impossible de supprimer cette ressource car elle est utilisée.',
                };

            case 'P2025':

                return {
                    statusCode:
                        HttpStatus.NOT_FOUND,

                    code: ErrorCode.DATABASE_ERROR,

                    message:
                        'Ressource introuvable.',
                };

            default:

                return {
                    statusCode: HttpStatus.CONFLICT,
                    code: ErrorCode.DATABASE_ERROR,
                    message: 'Une ressource avec cette valeur existe déjà.',
                };
        }
    }
}