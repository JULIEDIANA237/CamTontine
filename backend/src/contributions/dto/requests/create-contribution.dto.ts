import {
    IsDecimal,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateContributionDto {
    @ApiProperty({
        description: 'Identifiant UUID du membre (membership)',
    })
    @IsUUID()
    membershipId: string;

    @ApiProperty({
        description: 'Montant de la contribution',
        example: 25000,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Type(() => Number)
    amount: number;

    @ApiProperty({
        description: 'Note ou commentaire optionnel',
        required: false,
    })
    @IsOptional()
    @IsString()
    note?: string;
}
