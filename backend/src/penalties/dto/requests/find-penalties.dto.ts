import { ApiPropertyOptional } from '@nestjs/swagger';
import { PenaltyStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class FindPenaltiesDto {
    @ApiPropertyOptional({
        description: 'Numéro de page',
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: "Nombre d'éléments par page",
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({
        enum: PenaltyStatus,
        description: 'Filtrer par statut de pénalité',
    })
    @IsOptional()
    @IsEnum(PenaltyStatus)
    status?: PenaltyStatus;

    @ApiPropertyOptional({
        description: 'Filtrer par contribution ID',
    })
    @IsOptional()
    @IsUUID()
    contributionId?: string;
}
