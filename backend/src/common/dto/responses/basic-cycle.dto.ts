import { ApiProperty } from '@nestjs/swagger';
import { CycleStatus } from '@prisma/client';

export class BasicCycleDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    number: number;

    @ApiProperty({ nullable: true })
    name: string | null;

    @ApiProperty({ enum: CycleStatus })
    status: CycleStatus;
}
