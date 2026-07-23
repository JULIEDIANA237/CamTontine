import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsIn,
    IsOptional,
    IsString,
} from 'class-validator';

import { BaseRequestDto } from './base-request.dto';

export class SortDto extends BaseRequestDto {
    @ApiPropertyOptional({
        example: 'createdAt',
        description: 'Champ de tri',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        example: 'desc',
        enum: ['asc', 'desc'],
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc' = 'desc';
}