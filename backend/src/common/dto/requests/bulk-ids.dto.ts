import { ApiProperty } from '@nestjs/swagger';

import {
    ArrayMinSize,
    IsArray,
    IsUUID,
} from 'class-validator';

import { BaseRequestDto } from './base-request.dto';

export class BulkIdsDto extends BaseRequestDto {
    @ApiProperty({
        type: [String],
        example: [
            '550e8400-e29b-41d4-a716-446655440000',
            '550e8400-e29b-41d4-a716-446655440001',
        ],
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    ids: string[];
}