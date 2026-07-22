import { applyDecorators } from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAuth() {
    return applyDecorators(
        ApiBearerAuth(),

        ApiUnauthorizedResponse({
            description:
                'Authentification requise.',
        }),

        ApiForbiddenResponse({
            description:
                'Accès refusé.',
        }),
    );
}