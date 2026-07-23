import { ApiProperty } from '@nestjs/swagger';
import { PayoutStatus } from '@prisma/client';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class PayoutBeneficiarySummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: () => BasicUserDto })
    user: BasicUserDto;
}

export class PayoutCycleSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    number: number;

    @ApiProperty({ nullable: true })
    name: string | null;
}

export class PayoutResponseDto {
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

    @ApiProperty({ nullable: true })
    note: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: () => PayoutCycleSummaryDto })
    cycle: PayoutCycleSummaryDto;

    @ApiProperty({ type: () => PayoutBeneficiarySummaryDto })
    beneficiary: PayoutBeneficiarySummaryDto;
}
