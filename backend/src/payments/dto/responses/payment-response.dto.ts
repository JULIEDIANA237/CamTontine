import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class PaymentContributionSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    cycleId: string;

    @ApiProperty({ type: () => BasicUserDto })
    user: BasicUserDto;
}

export class PaymentResponseDto {
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
    transactionReference: string | null;

    @ApiProperty({ nullable: true })
    externalReference: string | null;

    @ApiProperty({ nullable: true })
    receiptNumber: string | null;

    @ApiProperty({ nullable: true })
    paidAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: () => PaymentContributionSummaryDto })
    contribution: PaymentContributionSummaryDto;
}
