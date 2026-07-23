import { ApiPropertyOptional } from '@nestjs/swagger';
import { PayoutStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class FindPayoutsDto {
    @ApiPropertyOptional({ description: 'Numéro de page', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: "Nombre d'éléments par page", default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({ enum: PayoutStatus, description: 'Filtrer par statut' })
    @IsOptional()
    @IsEnum(PayoutStatus)
    status?: PayoutStatus;

    @ApiPropertyOptional({ description: 'Filtrer par cycle ID' })
    @IsOptional()
    @IsUUID()
    cycleId?: string;

    @ApiPropertyOptional({ description: 'Filtrer par tontine ID' })
    @IsOptional()
    @IsUUID()
    tontineId?: string;
}
