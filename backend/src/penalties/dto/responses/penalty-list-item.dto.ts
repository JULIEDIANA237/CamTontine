import { ApiProperty } from '@nestjs/swagger';
import { PenaltyStatus } from '@prisma/client';

export class PenaltyListItemDto {
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
}
