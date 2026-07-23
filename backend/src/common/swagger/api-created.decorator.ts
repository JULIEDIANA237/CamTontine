import {
    applyDecorators,
    Type,
} from '@nestjs/common';

import {
    ApiCreatedResponse,
} from '@nestjs/swagger';

export function ApiCreated(
    dto: Type<unknown> | Type<unknown>[],
    description = 'Créé avec succès.',
) {
    const isArray = Array.isArray(dto);

    return applyDecorators(
        ApiCreatedResponse({
            description,
            type: isArray ? dto[0] : dto,
            isArray,
        }),
    );
}