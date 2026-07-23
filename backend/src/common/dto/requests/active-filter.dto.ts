import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
    IsBoolean,
    IsOptional,
} from 'class-validator';

import { BaseRequestDto } from './base-request.dto';

export class ActiveFilterDto extends BaseRequestDto {
    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    active?: boolean;
}