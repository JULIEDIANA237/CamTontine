import { ApiProperty } from '@nestjs/swagger';
import { CycleStatus } from '@prisma/client';

export class CycleListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    number: number;

    @ApiProperty({ nullable: true })
    name: string | null;

    @ApiProperty()
    dueDate: Date;

    @ApiProperty({ enum: CycleStatus })
    status: CycleStatus;

    @ApiProperty()
    expectedAmount: number;

    @ApiProperty()
    collectedAmount: number;

    @ApiProperty()
    isCurrent: boolean;

    @ApiProperty()
    createdAt: Date;
}