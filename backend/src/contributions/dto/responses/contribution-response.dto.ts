import { ApiProperty } from '@nestjs/swagger';
import { ContributionStatus, PaymentMethod, PaymentStatus, PenaltyStatus } from '@prisma/client';
import { BasicMembershipDto } from '../../../common/dto/responses/basic-membership.dto';
import { BasicCycleDto } from '../../../common/dto/responses/basic-cycle.dto';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class PaymentSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: PaymentMethod })
    method: PaymentMethod;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: PaymentStatus })
    status: PaymentStatus;

    @ApiProperty({ nullable: true })
    transactionReference: string | null;

    @ApiProperty({ nullable: true })
    receiptNumber: string | null;

    @ApiProperty({ nullable: true })
    paidAt: Date | null;
}

export class PenaltySummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    amount: number;

    @ApiProperty({ nullable: true })
    reason: string | null;

    @ApiProperty({ enum: PenaltyStatus })
    status: PenaltyStatus;
}

export class ContributionMemberDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    tontineId: string;

    @ApiProperty({ type: () => BasicUserDto })
    user: BasicUserDto;
}

export class ContributionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    membershipId: string;

    @ApiProperty()
    cycleId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: ContributionStatus })
    status: ContributionStatus;

    @ApiProperty({ nullable: true })
    paidAt: Date | null;

    @ApiProperty({ nullable: true })
    validatedAt: Date | null;

    @ApiProperty({ nullable: true })
    validatedById: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => ContributionMemberDto })
    membership: ContributionMemberDto;

    @ApiProperty({ type: () => BasicCycleDto })
    cycle: BasicCycleDto;

    @ApiProperty({ type: () => PaymentSummaryDto, nullable: true })
    payment: PaymentSummaryDto | null;

    @ApiProperty({ type: () => PenaltySummaryDto, nullable: true })
    penalty: PenaltySummaryDto | null;
}
