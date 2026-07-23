import { ApiProperty } from '@nestjs/swagger';
import { PayoutStatus } from '@prisma/client';

export class PayoutListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    cycleId: string;

    @ApiProperty()
    beneficiaryMembershipId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: PayoutStatus })
    status: PayoutStatus;

    @ApiProperty({ nullable: true })
    paidAt: Date | null;

    @ApiProperty()
    createdAt: Date;
}
