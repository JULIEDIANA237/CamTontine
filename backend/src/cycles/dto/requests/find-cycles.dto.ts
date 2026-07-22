import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { CycleStatus } from '@prisma/client';

export class FindCyclesDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page = 1;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 20;

    @IsOptional()
    @IsEnum(CycleStatus)
    status?: CycleStatus;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isCurrent?: boolean;

    @IsOptional()
    @IsString()
    search?: string;
}