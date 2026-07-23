import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto<T> {
    @ApiProperty({
        example: true,
    })
    success: true;

    @ApiProperty()
    message: string;

    data: T[];

    @ApiProperty({
        type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;
}