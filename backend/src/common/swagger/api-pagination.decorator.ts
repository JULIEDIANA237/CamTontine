import { Type } from '@nestjs/common';

import { applyDecorators } from '@nestjs/common';

import {
    ApiOkResponse,
} from '@nestjs/swagger';

export function ApiPagination(
    dto: Type<unknown>,
    description =
        'Liste paginée.',
) {
    return applyDecorators(
        ApiOkResponse({
            type: dto,

            isArray: true,

            description,
        }),
    );
}