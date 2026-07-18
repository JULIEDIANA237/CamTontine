import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { Request, Response } from 'express';

import { ErrorCode } from '../errors/error-codes';
import { PrismaErrorMapper } from '../prisma/prisma-error.mapper';

@Catch()
export class AllExceptionsFilter
    implements ExceptionFilter {
    private readonly logger = new Logger(
        AllExceptionsFilter.name,
    );

    catch(
        exception: unknown,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();

        const request =
            ctx.getRequest<Request>();

        const response =
            ctx.getResponse<Response>();

        let statusCode =
            HttpStatus.INTERNAL_SERVER_ERROR;

        let code =
            ErrorCode.INTERNAL_SERVER_ERROR;

        let message =
            'Une erreur interne est survenue.';

        /**
         * Exceptions HTTP (NestJS + Exceptions métier)
         */
        if (
            exception instanceof HttpException
        ) {
            statusCode =
                exception.getStatus();

            const exceptionResponse =
                exception.getResponse();

            if (
                typeof exceptionResponse ===
                'string'
            ) {
                message = exceptionResponse;
            } else {
                const body =
                    exceptionResponse as Record<
                        string,
                        unknown
                    >;

                if (
                    typeof body.code === 'string'
                ) {
                    code =
                        body.code as ErrorCode;
                }

                if (
                    Array.isArray(body.message)
                ) {
                    message =
                        body.message.join(', ');
                } else if (
                    body.message
                ) {
                    message = String(
                        body.message,
                    );
                }
            }
        }

        /**
         * Erreurs Prisma
         */
        else if (
            exception instanceof
            Prisma.PrismaClientKnownRequestError
        ) {
            const prismaError =
                PrismaErrorMapper.map(
                    exception,
                );

            statusCode =
                prismaError.statusCode;

            code = prismaError.code;

            message =
                prismaError.message;
        }

        /**
         * Erreur inconnue
         */
        else if (
            exception instanceof Error
        ) {
            this.logger.error(
                exception.stack,
            );
        }

        /**
         * Journalisation
         */
        this.logger.error({
            path: request.originalUrl,
            method: request.method,
            statusCode,
            code,
            message,
        });

        response.status(statusCode).json({
            success: false,

            statusCode,

            code,

            message,

            timestamp:
                new Date().toISOString(),

            path:
                request.originalUrl,
        });
    }
}