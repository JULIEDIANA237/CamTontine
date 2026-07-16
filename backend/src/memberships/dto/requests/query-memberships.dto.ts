import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryMembershipsDto {
    @ApiPropertyOptional({
        example: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Recherche par prénom, nom ou email',
        example: 'Julie',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        enum: MembershipRole,
    })
    @IsOptional()
    @IsEnum(MembershipRole)
    role?: MembershipRole;

    @ApiPropertyOptional({
        enum: MembershipStatus,
    })
    @IsOptional()
    @IsEnum(MembershipStatus)
    status?: MembershipStatus;
}