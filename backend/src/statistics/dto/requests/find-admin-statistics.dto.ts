import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsInt,
    IsOptional,
    Max,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class FindAdminStatisticsDto {
    @ApiPropertyOptional({
        example: 2026,
        description: "Année concernée",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(2000)
    @Max(2100)
    year?: number;

    @ApiPropertyOptional({
        example: 7,
        description: "Mois concerné (1 à 12)",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    month?: number;
}