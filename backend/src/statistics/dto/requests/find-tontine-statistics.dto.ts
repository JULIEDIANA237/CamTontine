import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsBoolean,
    IsOptional,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class FindTontineStatisticsDto {
    @ApiPropertyOptional({
        description: "Inclure les statistiques détaillées",
        default: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    detailed?: boolean = false;
}