import { ApiProperty } from '@nestjs/swagger';

export class TontineStatisticsResponseDto {
    @ApiProperty()
    members: number;

    @ApiProperty()
    activeMembers: number;

    @ApiProperty({
        nullable: true,
    })
    currentCycle: number | null;

    @ApiProperty()
    completedCycles: number;

    @ApiProperty()
    expectedAmount: number;

    @ApiProperty()
    collectedAmount: number;

    @ApiProperty()
    remainingAmount: number;

    @ApiProperty()
    validatedContributions: number;

    @ApiProperty()
    pendingContributions: number;

    @ApiProperty()
    penalties: number;

    @ApiProperty({
        example: 87,
        description: 'Pourcentage de progression',
    })
    completionRate: number;

    @ApiProperty({
        example: 25,
        description: 'Nombre de tours de passage générés',
    })
    payoutOrders: number;
}