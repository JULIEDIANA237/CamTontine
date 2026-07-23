import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsOptional,
    IsString,
} from 'class-validator';

import { BaseRequestDto } from './base-request.dto';

export class StatusFilterDto extends BaseRequestDto {
    @ApiPropertyOptional({
        example: 'ACTIVE',
    })
    @IsOptional()
    @IsString()
    status?: string;
}