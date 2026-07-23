import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreatePenaltyDto {
    @ApiProperty({
        description: 'Identifiant UUID de la contribution',
    })
    @IsUUID()
    contributionId: string;

    @ApiProperty({
        description: 'Montant de la pénalité',
        example: 5000,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({
        description: 'Motif de la pénalité',
        example: 'Retard de paiement de contribution',
    })
    @IsOptional()
    @IsString()
    reason?: string;
}
