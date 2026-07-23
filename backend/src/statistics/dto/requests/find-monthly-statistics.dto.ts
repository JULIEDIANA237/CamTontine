import { ApiProperty } from '@nestjs/swagger';

import {
    IsInt,
    Max,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class FindMonthlyStatisticsDto {
    @ApiProperty({
        example: 2026,
    })
    @Type(() => Number)
    @IsInt()
    @Min(2000)
    @Max(2100)
    year: number;
}