import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({
        description: 'Identifiant UUID de la contribution',
    })
    @IsUUID()
    contributionId: string;

    @ApiProperty({
        enum: PaymentMethod,
        description: 'Méthode de paiement',
        example: PaymentMethod.ORANGE_MONEY,
    })
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @ApiProperty({
        description: 'Montant du paiement',
        example: 25000,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({
        description: 'Référence de transaction externe (ex: MoMo TxID)',
    })
    @IsOptional()
    @IsString()
    transactionReference?: string;
}
