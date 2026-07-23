import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePayoutDto {
    @ApiProperty({ description: 'Identifiant UUID du cycle' })
    @IsUUID()
    cycleId: string;

    @ApiProperty({ description: 'Identifiant UUID du membre bénéficiaire' })
    @IsUUID()
    beneficiaryMembershipId: string;

    @ApiProperty({ description: 'Montant du versement (payout)', example: 250000 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({ description: 'Note ou remarque optionnelle' })
    @IsOptional()
    @IsString()
    note?: string;
}
