import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProcessPaymentDto {
    @ApiProperty({
        enum: [PaymentStatus.SUCCESS, PaymentStatus.FAILED],
        description: 'Statut du résultat du paiement (SUCCESS ou FAILED)',
    })
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @ApiPropertyOptional({
        description: 'Référence du reçu ou transaction',
    })
    @IsOptional()
    @IsString()
    receiptNumber?: string;

    @ApiPropertyOptional({
        description: 'Référence externe du processeur de paiement',
    })
    @IsOptional()
    @IsString()
    externalReference?: string;
}
