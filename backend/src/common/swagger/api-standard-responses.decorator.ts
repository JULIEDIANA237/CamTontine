import { applyDecorators } from '@nestjs/common';

import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';

interface Options {
    badRequest?: string;

    notFound?: string;

    conflict?: string;
}

export function ApiStandardResponses(
    options?: Options,
) {
    return applyDecorators(
        ApiBadRequestResponse({
            description:
                options?.badRequest ??
                'Requête invalide.',
        }),

        ApiNotFoundResponse({
            description:
                options?.notFound ??
                'Ressource introuvable.',
        }),

        ApiConflictResponse({
            description:
                options?.conflict ??
                'Conflit de données.',
        }),

        ApiInternalServerErrorResponse({
            description:
                'Erreur interne du serveur.',
        }),
    );
}