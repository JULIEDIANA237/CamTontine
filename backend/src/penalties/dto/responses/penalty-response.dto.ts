import { ApiProperty } from '@nestjs/swagger';
import { PenaltyStatus } from '@prisma/client';
import { BasicUserDto } from '../../../common/dto/responses/basic-user.dto';

export class PenaltyContributionSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    cycleId: string;

    @ApiProperty({ type: () => BasicUserDto })
    user: BasicUserDto;
}

export class PenaltyResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    contributionId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty({ nullable: true })
    reason: string | null;

    @ApiProperty({ enum: PenaltyStatus })
    status: PenaltyStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: () => PenaltyContributionSummaryDto })
    contribution: PenaltyContributionSummaryDto;
}
