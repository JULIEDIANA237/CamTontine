import { ApiProperty } from '@nestjs/swagger';

import {
    IsArray,
    ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class BulkUpdateItemDto<T = unknown> {
    @ApiProperty()
    id: string;

    @ApiProperty()
    data: T;
}

export class BulkUpdateDto<T = unknown> {
    @ApiProperty({
        isArray: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BulkUpdateItemDto)
    items: BulkUpdateItemDto<T>[];
}