import { Type } from '@nestjs/common';

import { applyDecorators } from '@nestjs/common';

import {
    ApiOkResponse,
} from '@nestjs/swagger';

export function ApiUpdated(
    dto: Type<unknown>,
    description =
        'Mis à jour avec succès.',
) {
    return applyDecorators(
        ApiOkResponse({
            type: dto,

            description,
        }),
    );
}