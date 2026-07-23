import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
    IsDate,
    IsOptional,
} from 'class-validator';

export class DateRangeDto {
    @ApiPropertyOptional({
        example: '2026-01-01',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @ApiPropertyOptional({
        example: '2026-12-31',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;
}