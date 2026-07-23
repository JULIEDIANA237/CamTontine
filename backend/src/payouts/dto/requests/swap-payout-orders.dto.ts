import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SwapPayoutOrdersDto {
    @ApiProperty({ description: 'Identifiant UUID du premier PayoutOrder' })
    @IsUUID()
    firstOrderId: string;

    @ApiProperty({ description: 'Identifiant UUID du second PayoutOrder' })
    @IsUUID()
    secondOrderId: string;
}
