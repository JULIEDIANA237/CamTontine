import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    contributionId: string;

    @ApiProperty({ enum: PaymentMethod })
    method: PaymentMethod;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: PaymentStatus })
    status: PaymentStatus;

    @ApiProperty({ nullable: true })
    receiptNumber: string | null;

    @ApiProperty({ nullable: true })
    paidAt: Date | null;

    @ApiProperty()
    createdAt: Date;
}
