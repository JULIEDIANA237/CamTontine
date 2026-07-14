import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import {
    Frequency,
    TontineStatus,
} from '@prisma/client';

export class QueryTontinesDto {
    @ApiPropertyOptional({
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page = 1;

    @ApiPropertyOptional({
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit = 10;

    @ApiPropertyOptional({
        example: 'Famille',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        enum: Frequency,
    })
    @IsOptional()
    @IsEnum(Frequency)
    frequency?: Frequency;

    @ApiPropertyOptional({
        enum: TontineStatus,
    })
    @IsOptional()
    @IsEnum(TontineStatus)
    status?: TontineStatus;
}