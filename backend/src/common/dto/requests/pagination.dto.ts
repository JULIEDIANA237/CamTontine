import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
    IsInt,
    IsOptional,
    Max,
    Min,
} from 'class-validator';

import { BaseRequestDto } from './base-request.dto';

export class PaginationDto extends BaseRequestDto {
    @ApiPropertyOptional({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Numéro de la page',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @ApiPropertyOptional({
        example: 20,
        default: 20,
        minimum: 1,
        maximum: 100,
        description: "Nombre d'éléments par page",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 20;
}