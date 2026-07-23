import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContributionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class FindContributionsDto {
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
        enum: ContributionStatus,
        description: 'Filtrer par statut',
    })
    @IsOptional()
    @IsEnum(ContributionStatus)
    status?: ContributionStatus;

    @ApiPropertyOptional({
        description: 'Filtrer par membership (membre)',
    })
    @IsOptional()
    @IsUUID()
    membershipId?: string;
}
