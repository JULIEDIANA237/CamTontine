import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UserRole, UserStatus } from '@prisma/client';

export class QueryUsersDto {
    @ApiPropertyOptional({
        example: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page = 1;

    @ApiPropertyOptional({
        example: 10,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit = 10;

    @ApiPropertyOptional({
        example: 'john',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        enum: UserRole,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({
        enum: UserStatus,
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}