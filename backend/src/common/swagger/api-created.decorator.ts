import { Type } from '@nestjs/common';

import { applyDecorators } from '@nestjs/common';

import {
    ApiCreatedResponse,
} from '@nestjs/swagger';

export function ApiCreated(
    dto: Type<unknown>,
    description =
        'Créé avec succès.',
) {
    return applyDecorators(
        ApiCreatedResponse({
            type: dto,

            description,
        }),
    );
}