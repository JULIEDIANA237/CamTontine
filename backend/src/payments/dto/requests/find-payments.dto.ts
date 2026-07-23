import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class FindPaymentsDto {
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
        enum: PaymentStatus,
        description: 'Filtrer par statut du paiement',
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @ApiPropertyOptional({
        enum: PaymentMethod,
        description: 'Filtrer par méthode de paiement',
    })
    @IsOptional()
    @IsEnum(PaymentMethod)
    method?: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Filtrer par contribution ID',
    })
    @IsOptional()
    @IsUUID()
    contributionId?: string;
}
