import { ApiProperty } from '@nestjs/swagger';
import { CycleStatus } from '@prisma/client';
import { BasicTontineDto } from '../../../common/dto/responses/basic-tontine.dto';

export class CycleResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    number: number;

    @ApiProperty({ nullable: true })
    name: string | null;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    dueDate: Date;

    @ApiProperty()
    expectedAmount: number;

    @ApiProperty()
    collectedAmount: number;

    @ApiProperty({ enum: CycleStatus })
    status: CycleStatus;

    @ApiProperty()
    isCurrent: boolean;

    @ApiProperty({ nullable: true })
    openedAt: Date | null;

    @ApiProperty({ nullable: true })
    closedAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: () => BasicTontineDto })
    tontine: BasicTontineDto;

    @ApiProperty()
    contributionCount: number;

    @ApiProperty({ nullable: true })
    payoutId: string | null;
}
