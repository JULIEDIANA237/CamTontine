import { ApiProperty } from '@nestjs/swagger';
import { ContributionStatus } from '@prisma/client';

export class ContributionListItemDto {
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

    @ApiProperty()
    createdAt: Date;
}
